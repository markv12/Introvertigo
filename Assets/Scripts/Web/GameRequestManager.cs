
using System;
using System.Collections.Generic;
using System.Linq;
using UnityEngine;
using UnityEngine.InputSystem;

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
public class GPTResponse {
    public int rudeness;
    public int rating;
    public string reply;
    public GameMessage[] messages;
}

public class GameRequestManager : Singleton<GameRequestManager> {
    private GameScenario currentScenario;
    public static GameScenario CurrentScenario => Instance.currentScenario;
    public void GetGameScenario(string sceneKey, Action onComplete) {
        string uri = "https://p.jasperstephenson.com/ld54/getscenario";
        if (!string.IsNullOrWhiteSpace(sceneKey)) {
            uri += "?key=" + sceneKey;
        }
        StartCoroutine(RestUtility.Get(uri, (response) => {
            currentScenario = JsonUtility.FromJson<GameScenario>(response);
            onComplete();
        }, () => {
            onComplete();
        }));
    }

    public void SubmitNextMessage(string newMessage, Action<GPTResponse> onComplete) {
        List<GameMessage> messages = currentScenario.messages == null ? new List<GameMessage>() : currentScenario.messages.ToList();
        messages.Add(new GameMessage() { content = newMessage, role = "user" });
        GameRequest gr = new GameRequest() { messages = messages.ToArray() };

        StartCoroutine(RestUtility.PostJSON("https://p.jasperstephenson.com/ld54/response", JsonUtility.ToJson(gr), (success, response) => {
            Debug.Log(response);
            GPTResponse rr = JsonUtility.FromJson<GPTResponse>(response);
            currentScenario.messages = rr.messages;
            onComplete(rr);
        }));
    }
}

