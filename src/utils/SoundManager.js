export class SoundManager {
    constructor() {
        this.sounds = {};
        this.enabled = true;
    }

    // 사운드 로드 (에러 방지 로직 포함)
    load(key, src) {
        try {
            const audio = new Audio(src);
            audio.addEventListener('error', () => {
                console.warn(`[SoundManager] '${key}' 파일을 찾을 수 없음: ${src}`);
                this.sounds[key] = null; // 로드 실패 시 null 처리
            });
            this.sounds[key] = audio;
        } catch (e) {
            console.error(`[SoundManager] 초기화 에러:`, e);
            this.sounds[key] = null;
        }
    }

    // 재생 시 예외 처리
    play(key) {
        const sound = this.sounds[key];
        if (this.enabled && sound) {
            sound.currentTime = 0;
            // 브라우저 정책상 사용자 상호작용 후 재생 가능하므로 Promise 예외 처리
            sound.play().catch(err => {
                console.warn(`[SoundManager] '${key}' 재생 차단됨 (사용자 상호작용 필요)`);
            });
        }
    }
}

export const soundManager = new SoundManager();

// 초기 로드 설정
// Note: Ensure these files exist in public/assets/sounds/
soundManager.load('hit', '/assets/sounds/hit.mp3');
soundManager.load('miss', '/assets/sounds/miss.mp3');
