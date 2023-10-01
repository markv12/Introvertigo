using System;
using UnityEngine;

public class UrinalSceneAnimator : SceneAnimator {
    public UrinalSceneStep[] steps;
    public SpriteRenderer playerRenderer;
    public Transform enemyT;
    public SpriteRenderer enemyRenderer;
    public WorldSpriteSineColorAnimator enemySineAnim;

    public Transform cameraT;
    public int startIndex;
    private int currentIndex;
    private void Start() {
        MoveToIndex(startIndex);
    }

    private int rudeCount = 0;
    public override EndType HandleResponse(GPTResponse gptResponse) {
        if (gptResponse.rudeness > 0) {
            rudeCount++;
        }
        if (rudeCount == 0) {
            enemySineAnim.enabled = false;
            enemyRenderer.color = Color.white;
        } else if (rudeCount == 1) {
            enemySineAnim.enabled = true;
        } else if (rudeCount >= 2) {
            return EndType.rude;
        }

        if (gptResponse.rating < -0.1f) {
            if(currentIndex < steps.Length - 1) {
                MoveToIndex(currentIndex + 1);
            } else {
                return EndType.good;
            }
        } else if (gptResponse.rating > 0.1f) {
            if(currentIndex > 0) {
                MoveToIndex(currentIndex - 1);
            } else {
                return EndType.bad;
            }
        }
     
        return EndType.none;
    }

    private Coroutine enemyRoutine;
    private Coroutine cameraRoutine;
    private void MoveToIndex(int index) {
        currentIndex = index;
        UrinalSceneStep step = steps[index];
        playerRenderer.sprite = step.playerSprite;
        Vector3 enemyStartPos = enemyT.position;
        Vector3 enemyEndPos = step.enemyPos.position;
        enemyRenderer.sprite = step.enemySprite;

        Vector3 cameraStartPos = cameraT.position;
        Vector3 cameraEndPos = step.cameraPos.position;
        Quaternion cameraStartRotation = cameraT.rotation;
        Quaternion cameraEndRotation = step.cameraPos.rotation;

        this.EnsureCoroutineStopped(ref enemyRoutine);
        enemyRoutine = this.CreateAnimationRoutine(1.2f, (float progress) => {
            enemyT.position = Vector3.Lerp(enemyStartPos, enemyEndPos, Easing.easeInOutSine(0, 1, progress));
        });

        this.EnsureCoroutineStopped(ref cameraRoutine);
        cameraRoutine = this.CreateAnimationRoutine(1.35f, (float progress) => {
            float easedProgress = Easing.easeInOutSine(0, 1, progress);
            cameraT.SetPositionAndRotation(Vector3.Lerp(cameraStartPos, cameraEndPos, easedProgress), Quaternion.Lerp(cameraStartRotation, cameraEndRotation, easedProgress));
        });
    }
}

[Serializable]
public class UrinalSceneStep {
    public Transform cameraPos;
    public Transform enemyPos;
    public Sprite enemySprite;
    public Sprite playerSprite;
}
