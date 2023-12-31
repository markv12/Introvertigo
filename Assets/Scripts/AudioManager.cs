using System.Collections.Generic;
using UnityEngine;

public class AudioManager : MonoBehaviour {
    private const string AUDIO_MANAGER_PATH = "AudioManager";
    private static AudioManager instance;
    public static bool InstanceNull => instance == null;
    public static AudioManager Instance {
        get {
            if (instance == null) {
                GameObject audioManagerObject = (GameObject)Resources.Load(AUDIO_MANAGER_PATH);
                GameObject instantiated = Instantiate(audioManagerObject);
                DontDestroyOnLoad(instantiated);
                instance = instantiated.GetComponent<AudioManager>();
            }
            return instance;
        }
    }

    [Header("Sound Effects")]
    public AudioSource[] audioSources;

    [Range(0f, 1f)]
    public float heartBeatVolume = 1f;
    public AudioSource heartBeatSource;

    private int audioSourceIndex = 0;

    public AudioClip talk;
    public AudioClip rude;
    public AudioClip moveCloser;

    public void PlayPlayerTalkSound(float intensity, float pitchCenter, float pitchVarianceMultiplier = 1) {
        PlayRandomPitchSound(talk, intensity, pitchCenter, pitchVarianceMultiplier);
    }

    public void PlayRudeSound() {
        PlaySFX(rude, 0.6f, 1);
    }

    public void PlayMoveCloserSound() {
        PlaySFX(moveCloser, 0.7f, 1);
    }

    public void PlayRandomPitchSound(AudioClip clip, float intensity, float pitchCenter, float pitchVarianceMultiplier = 1) {
        float basePitchVariance = 0.4f;
        float pitchVarianceToUse = basePitchVariance * pitchVarianceMultiplier;
        PlaySFX(clip, 1.0f * Random.Range(0.5f, 1.5f) * intensity, Random.Range(1.0f - pitchVarianceToUse, 1.0f + pitchVarianceToUse) * pitchCenter);
    }

    public void PlaySFX(AudioClip clip, float volume, float pitch = 1) {
        AudioSource source = GetNextAudioSource();
        source.volume = volume/* * SettingsManager.SFXVolume*/;
        source.pitch = pitch;
        source.PlayOneShot(clip);
    }

    private AudioSource GetNextAudioSource() {
        AudioSource result = audioSources[audioSourceIndex];
        audioSourceIndex = (audioSourceIndex + 1) % audioSources.Length;
        return result;
    }

    public void PlayHeartBeat() {
        this.EnsureCoroutineStopped(ref heartBeatFade);
        heartBeatSource.volume = heartBeatVolume;
        if (!heartBeatSource.isPlaying) {
            heartBeatSource.Play();
        }
    }

    private Coroutine heartBeatFade = null;
    public void StopHeartBeat() {
        this.EnsureCoroutineStopped(ref heartBeatFade);
        float startVolume = heartBeatSource.volume;
        heartBeatFade = this.CreateAnimationRoutine(0.3f, (float progress) => {
            heartBeatSource.volume = Mathf.Lerp(startVolume, 0, progress);
        }, () => {
            heartBeatSource.Stop();
        });
    }

    private readonly List<BGAudio> activeBGAudio = new List<BGAudio>(4);
    public void RegisterBGAudio(BGAudio bgAudio) {
        activeBGAudio.Add(bgAudio);
    }
    public void UnregisterBGAudio(BGAudio bgAudio) {
        activeBGAudio.Remove(bgAudio);
    }

    public void FadeOutBGAudio() {
        for (int i = 0; i < activeBGAudio.Count; i++) {
            activeBGAudio[i].FadeOut();
        }
    }
}
