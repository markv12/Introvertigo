
public static class GameFlowManager {
    private static readonly string[] sceneOrder = new string[] { "UrinalScene" };
    private static int sceneIndex;
    public static void StartGame() {
        sceneIndex = 0;
        LoadingScreen.LoadScene(sceneOrder[sceneIndex]);
    }

    public static void NextScene() {
        sceneIndex++;
        if(sceneIndex < sceneOrder.Length) {
            LoadingScreen.LoadScene(sceneOrder[sceneIndex]);
        } else {
            LoadingScreen.LoadScene("StartScreen");
        }
    }
}
