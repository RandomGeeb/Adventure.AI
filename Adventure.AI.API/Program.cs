using Adventure.AI.API.Models;
using System.Runtime.CompilerServices;
using System.Text.Json.Serialization;

namespace Adventure.AI.API
{
    public class Program
    {
        public static void Main(string[] args)
        {
            DotNetEnv.Env.Load();

            var builder = WebApplication.CreateSlimBuilder(args);

            builder.Services.ConfigureHttpJsonOptions(options =>
            {
                options.SerializerOptions.TypeInfoResolverChain.Insert(0, AppJsonSerializerContext.Default);
            });
            builder.Services.AddSingleton<GeminiService>();

            var app = builder.Build();

            var storyApi = app.MapGroup("/story");
            storyApi.MapPost("/setup", async (Setup setup, GeminiService geminiService) =>
            {
                geminiService.Initialize(setup);
                var result = await geminiService.GetResponse("Start the story");
                return Results.Ok(result);
            });
            storyApi.MapPost("/write-prompt", async (Prompt prompt, GeminiService geminiService) =>
            {
                var result = await geminiService.GetResponse(prompt.Content);
                return Results.Ok(result);
            });

            app.Run();
        }
    }

    [JsonSerializable(typeof(Prompt))]
    [JsonSerializable(typeof(Setup))]
    internal partial class AppJsonSerializerContext : JsonSerializerContext
    {

    }
}
