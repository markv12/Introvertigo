
using System;
using System.Collections.Generic;
using System.Linq;
using UnityEngine;

[Serializable]
public class GameMessage {
    public string content;
    public string role;
}

[Serializable]
public class GameScenario {
    public string key;
    public GameMessage[] messages;
    public string backstory;
    public string[] requiredWords;
}

[Serializable]
public class GameRequest {
    public GameMessage[] messages;
}

[Serializable]
public class RequestResponse {
    public int rudeness;
    public int rating;
    public string reply;
    public GameMessage[] messages;
}

public class GameRequestManager : Singleton<GameRequestManager> {
    GameScenario currentScenario;
    public void GetGameScenario(Action<GameScenario> onComplete) {
        StartCoroutine(RestUtility.Get("https://p.jasperstephenson.com/ld54/getscenario", (response) => {
            currentScenario = JsonUtility.FromJson<GameScenario>(response);
            onComplete(currentScenario);
        }, () => {
            onComplete(null);
        }));
    }

    public void SubmitNextMessage(string newMessage, Action<RequestResponse> onComplete) {
        List<GameMessage> messages = currentScenario.messages == null ? new List<GameMessage>() : currentScenario.messages.ToList();
        messages.Add(new GameMessage() { content = newMessage, role = "user" });
        GameRequest gr = new GameRequest() { messages = messages.ToArray() };

        StartCoroutine(RestUtility.PostJSON("https://p.jasperstephenson.com/ld54/response", JsonUtility.ToJson(gr), (success, response) => {
            RequestResponse rr = JsonUtility.FromJson<RequestResponse>(response);
            currentScenario.messages = rr.messages;
            onComplete(rr);
        }));
    }
}

