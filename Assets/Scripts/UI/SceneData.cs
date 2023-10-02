using System;
using UnityEngine;

[CreateAssetMenu(fileName = "SceneData", menuName = "Scene Data")]
public class SceneData : ScriptableObject {
    public ScenePogPair[] enemyPogs;
    public Sprite safeSprite;
    public Sprite tooCloseSprite;
    public Sprite rudeSprite;

    public Sprite GetPogForScene(Scenes scene) {
        for (int i = 0; i < enemyPogs.Length; i++) {
            ScenePogPair spp = enemyPogs[i];
            if(spp.scene == scene) {
                return spp.pog;
            }
        }
        return null;
    }

    public Sprite GetSpriteForEndType(EndType endType) {
        switch (endType) {
            case EndType.rude:
                return rudeSprite;
            case EndType.bad:
                return tooCloseSprite;
            case EndType.good:
                return safeSprite;
            default:
                return null;
        }
    }

    [Serializable]
    public class ScenePogPair {
        public Scenes scene;
        public Sprite pog;
    }
}
