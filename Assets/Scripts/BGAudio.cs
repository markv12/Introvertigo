using System.Collections;
using UnityEngine;

public class BGAudio : MonoBehaviour {
    public AudioSource audioSource;

    public void FadeOut() {
        float mainVolume = audioSource.volume;
        this.CreateAnimationRoutine(0.74f, (float progress) => {
            audioSource.volume = Mathf.Lerp(mainVolume, 0, progress);
        }, () => {
            audioSource.Stop();
        });
    }

    IEnumerator Start() {
        AudioManager.Instance.RegisterBGAudio(this);
        yield return null;
        yield return null;
        float mainVolume = audioSource.volume;
        audioSource.volume = 0;
        audioSource.Play();
        this.CreateAnimationRoutine(2f, (float progress) => {
            audioSource.volume = Mathf.Lerp(0, mainVolume, progress);
        });
    }

    private void OnDestroy() {
        if(!AudioManager.InstanceNull) {
            AudioManager.Instance.UnregisterBGAudio(this);
        }
    }
}
