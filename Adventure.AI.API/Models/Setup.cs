namespace Adventure.AI.API.Models
{
    public enum STORY_TYPE
    {
        FANTASY = 1,
        CYBER_PUNK,
        SCI_FI
    }

    public class Setup
    {
        public STORY_TYPE StoryType { get; set; }
        public string CharacterDescription { get; set; }
    }
}