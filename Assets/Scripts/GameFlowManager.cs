using System;
using System.Collections.Generic;
using UnityEngine;

public static class GameFlowManager {
    private static readonly Scenes[] sceneOrder = new Scenes[] { Scenes.URINAL_SCENE, Scenes.GRANNY_SCENE, Scenes.GYM_SCENE };
    public static readonly List<GameResult> gameResults = new List<GameResult>(8);

    public static float startTime;
    public static void StartGame() {
        startTime = Time.time;
        gameResults.Clear();
        LoadingScreen.LoadScene(sceneOrder[0].Name());
    }

    public static void RecordSceneResult(Scenes scene, EndType endType, int messageTotal) {
        gameResults.Add(new GameResult() { scene = scene, endType = endType, messageTotal = messageTotal });
    }

    public static void NextScene() {
        int nextSceneIndex = GetNextSceneIndex();
        if(nextSceneIndex < sceneOrder.Length) {
            LoadingScreen.LoadScene(sceneOrder[nextSceneIndex].Name());
        } else {
            LoadingScreen.LoadScene(Scenes.END_SCREEN.Name());
        }
    }

    private static int GetNextSceneIndex() {
        Scenes currentScene = SceneHelper.CurrentScene;
        for (int i = 0; i < sceneOrder.Length; i++) {
            if (sceneOrder[i] == currentScene) {
                return i + 1;
            }
        }
        return sceneOrder.Length;
    }
}
public class GameResult {
    public Scenes scene;
    public EndType endType;
    public int messageTotal;
}
