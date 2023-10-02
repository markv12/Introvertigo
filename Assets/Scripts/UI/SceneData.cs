using System;
using UnityEngine;

[CreateAssetMenu(fileName = "SceneData", menuName = "Scene Data")]
public class SceneData : ScriptableObject {
    public ScenePogSet[] enemyPogs;
    public Sprite safeSprite;
    public Sprite tooCloseSprite;
    public Sprite rudeSprite;

    public Sprite GetPogForScene(Scenes scene, EndType endType) {
        for (int i = 0; i < enemyPogs.Length; i++) {
            ScenePogSet sps = enemyPogs[i];
            if(sps.scene == scene) {
                switch (endType) {
                    case EndType.good:
                        return sps.goodPog;
                    case EndType.rude:
                        return sps.rudePog;
                    case EndType.bad:
                        return sps.badPog;
                }
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
    public class ScenePogSet {
        public Scenes scene;
        public Sprite goodPog;
        public Sprite rudePog;
        public Sprite badPog;
    }
}
