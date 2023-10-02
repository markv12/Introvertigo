using UnityEngine.SceneManagement;

public enum Scenes {
    START_SCREEN,
    URINAL_SCENE,
    GRANNY_SCENE,
    GYM_SCENE,
    TRAIN_SCENE,
    END_SCREEN,
}

public static class ScenesExtensions {
    public static string Name(this Scenes me) {
        switch (me) {
            case Scenes.START_SCREEN:
                return "StartScreen";
            case Scenes.URINAL_SCENE:
                return "UrinalScene";
            case Scenes.GRANNY_SCENE:
                return "GrannyScene";
            case Scenes.GYM_SCENE:
                return "GymScene";
            case Scenes.TRAIN_SCENE:
                return "TrainScene";
            case Scenes.END_SCREEN:
                return "EndScreen";
            default:
                return "Scene Not Found";
        }
    }
}

public static class SceneHelper {
    public static Scenes CurrentScene {
        get {
            switch (SceneManager.GetActiveScene().name) {
                case "StartScreen":
                    return Scenes.START_SCREEN;
                case "UrinalScene":
                    return Scenes.URINAL_SCENE;
                case "GrannyScene":
                    return Scenes.GRANNY_SCENE;
                case "GymScene":
                    return Scenes.GYM_SCENE;
                case "TrainScene":
                    return Scenes.TRAIN_SCENE;
                case "EndScreen":
                    return Scenes.END_SCREEN;
                default:
                    return Scenes.START_SCREEN;
            }
        }
    }
}
