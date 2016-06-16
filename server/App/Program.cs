using Microsoft.Owin.Hosting;
using Owin;
using Microsoft.Owin.Cors;
using System;
using Microsoft.AspNet.SignalR;
using System.Web.Http;
using System.Threading.Tasks;

namespace App
{
    class Program
    {
        static void Main(string[] args)
        {
            // This will *ONLY* bind to localhost, if you want to bind to all addresses 
            // use http://*:8080 to bind to all addresses.  
            // See http://msdn.microsoft.com/en-us/library/system.net.httplistener.aspx  
            // for more information. 
            string url = "http://localhost:8080";
            using (WebApp.Start<Startup>(url))
            {
                Console.WriteLine("Server running on {0}", url);
                Console.ReadLine();
            }
        }
    }

    class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            app.UseCors(CorsOptions.AllowAll);
            var config = new HttpConfiguration();
            config.MapHttpAttributeRoutes();

            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/{controller}/{id}",
                defaults: new { id = RouteParameter.Optional }
            );
            app.UseWebApi(config);
            app.MapSignalR();
        }
    }

    public interface IEchoClient
    {
        Task OnEcho(string m);
    }

    public class EchoHub : Hub
    {
    }

    public class EchoController : ApiController
    {
        IHubContext<IEchoClient> _hub = GlobalHost.ConnectionManager.GetHubContext<EchoHub, IEchoClient>();

        public async Task<IHttpActionResult> Get(string message)
        {
            var uri = ActionContext.Request.RequestUri.AbsolutePath;
            var action = ActionContext.ActionDescriptor.ActionName;

            Console.WriteLine($"{uri} {action.ToUpper()} message=\"{message}\"");

            await _hub.Clients.All.OnEcho(message);

            return Ok();
        }
    }
}