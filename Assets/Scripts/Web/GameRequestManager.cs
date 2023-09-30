
using UnityEngine;

public class GameMessage
{
    public string content;
    public string role;
}

public class GameScenario
{
    public string key;
    public GameMessage[] messages;
    public string backstory;
    public string[] requiredWords;
}
public class GameRequestManager
{
    public static async GameScenario GetGameScenario()
    {

        var scenario = RestUtility.Get("https://p.jasperstephenson.com/ld54/getscenario", (response) =>
        {
            Debug.Log("Response: " + response);
            GameScenario scenario = JsonUtility.FromJson<GameScenario>(response);
            Debug.Log("Scenario: " + scenario);
            return scenario;
        }, () =>
        {
            Debug.Log("Error!");
            return null;
        });
    }
}

