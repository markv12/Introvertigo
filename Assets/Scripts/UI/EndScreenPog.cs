using System;
using UnityEngine;
using UnityEngine.UI;

public class EndScreenPog : MonoBehaviour {
    public Image enemyPog;
    public Image result;
    public SceneData sceneData;
    public void ShowResult(GameResult gr) {
        enemyPog.sprite = sceneData.GetPogForScene(gr.scene);
        result.sprite = sceneData.GetSpriteForEndType(gr.endType);
    }
}
