using System.Collections.Generic;

public static class GameFlowManager {
    private static readonly string[] sceneOrder = new string[] { "UrinalScene", "GrannyScene" };
    private static int sceneIndex;
    private static readonly List<GameResult> gameResults = new List<GameResult>(8);

    public static void StartGame() {
        sceneIndex = 0;
        gameResults.Clear();
        LoadingScreen.LoadScene(sceneOrder[sceneIndex]);
    }

    public static void RecordSceneResult(EndType endType, int messageTotal) {
        gameResults.Add(new GameResult() { endType = endType, messageTotal = messageTotal });
    }

    public static void NextScene() {
        sceneIndex++;
        if(sceneIndex < sceneOrder.Length) {
            LoadingScreen.LoadScene(sceneOrder[sceneIndex]);
        } else {
            LoadingScreen.LoadScene("EndScreen");
        }
    }
}
public class GameResult {
    public EndType endType;
    public int messageTotal;
}
