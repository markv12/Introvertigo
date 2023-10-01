using System;
using UnityEngine;

public class GrannySceneAnimator : SceneAnimator {
    public Transform cameraT;
    public Camera mainCamera;
    public GrannySceneStep[] steps;
    public int startIndex;
    private int currentIndex;

    private void Start() {
        MoveToIndex(startIndex);
    }

    public override EndType HandleResponse(GPTResponse gptResponse) {
        //MoveToIndex(currentIndex - 1);
        if (gptResponse.rudeness > 0) {
            return EndType.rude;
        }

        if (gptResponse.rating < -RATING_DEAD_ZONE) {
            if (currentIndex < steps.Length - 1) {
                MoveToIndex(currentIndex + 1);
            } else {
                return EndType.good;
            }
        } else if (gptResponse.rating > RATING_DEAD_ZONE) {
            if (currentIndex > 0) {
                MoveToIndex(currentIndex - 1);
            } else {
                return EndType.bad;
            }
        }
        return EndType.none;
    }

    private Coroutine cameraRoutine;
    private void MoveToIndex(int index) {
        currentIndex = index;
        GrannySceneStep step = steps[index];

        Vector3 cameraStartPos = cameraT.position;
        Vector3 cameraEndPos = step.cameraPos.position;
        Quaternion cameraStartRotation = cameraT.rotation;
        Quaternion cameraEndRotation = step.cameraPos.rotation;
        float startFOV = mainCamera.fieldOfView;
        float endFOV = step.cameraFOV;

        this.EnsureCoroutineStopped(ref cameraRoutine);
        bool swappedGranny = false;
        cameraRoutine = this.CreateAnimationRoutine(1.5f, (float progress) => {
            float easedProgress = Easing.easeInOutSine(0, 1, progress);
            cameraT.SetPositionAndRotation(Vector3.Lerp(cameraStartPos, cameraEndPos, easedProgress), Quaternion.Lerp(cameraStartRotation, cameraEndRotation, easedProgress));
            mainCamera.fieldOfView = Mathf.Lerp(startFOV, endFOV, easedProgress);
            if(progress > 0.5f && !swappedGranny) {
                swappedGranny = true;
                for (int i = 0; i < steps.Length; i++) {
                    steps[i].granny.SetActive(i == currentIndex);
                }
            }
        });
    }
}

[Serializable]
public class GrannySceneStep {
    public Transform cameraPos;
    public float cameraFOV;
    public GameObject granny;
}
