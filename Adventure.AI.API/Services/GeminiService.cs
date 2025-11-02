using Adventure.AI.API.Models;
using Mscc.GenerativeAI;

public class GeminiService
{
    private GenerativeModel generativeModel;
    private ChatSession chatSession;
    private bool chatInit = false;

    private string apiKey;
    private Setup setup;

    public void Initialize(Setup setup)
    {
        this.setup = setup;
        if (generativeModel == null)
        {
            apiKey = Environment.GetEnvironmentVariable("GEMINI_API_KEY");
            IGenerativeAI googleAI = new GoogleAI(apiKey);
            generativeModel = googleAI.GenerativeModel(
                model: Model.Gemini25Flash,
                systemInstruction: new Content(
                    $"You are a story teller for an advernture game for the {StoryString(setup.StoryType)} genre. Begin by writing the opening of a random story based on the given genre. You must ask the player what they want to do next after every prompt, in order to continue the story. Keep each continuation brief and not too descript. Remember previoius player actions, and make sure player actions have an impact on the storyline. Never summarise the story, always continue with the next part and alter according to player response for in-game choices. The description of the player is: {setup.CharacterDescription}."
                )
            );
        }
    }

    private string StoryString(STORY_TYPE type) => type switch
    {
        STORY_TYPE.FANTASY => "Fantasy",
        STORY_TYPE.SCI_FI => "Sci-Fi",
        STORY_TYPE.CYBER_PUNK => "Cyberpunk",
        _ => "Fantasy"
    };

    public async Task<string> GetResponse(string prompt)
    {
        if (!chatInit) InitChatSession();
        var response = await chatSession.SendMessage(prompt);
        return response.Text;
    }

    private void InitChatSession()
    {
        chatSession = generativeModel.StartChat();
        chatInit = true;
    }
}
