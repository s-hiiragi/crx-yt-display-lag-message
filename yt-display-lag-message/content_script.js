const _main = () => {
    const eVideo = document.querySelector('video.video-stream');
    const eProgressBar = document.querySelector('.ytp-progress-bar');
    const eContainer = document.querySelector('#chat-container');

    if (eVideo === null || eProgressBar === null || eContainer === null) {
        return false;
    }

    const eMessage = document.createElement('div');
    eMessage.style.cssText = 'color: red; font-size: 16px;';
    eContainer.parentNode.insertBefore(eMessage, eContainer.nextSibling);

    const makeLagMessage = (s) => `リアルタイムから${s}秒ズレています。`;
    const handler = () => {
        if (eProgressBar.getAttribute('draggable') === null) {
            eVideo.removeEventListener('play', handler);
            eVideo.removeEventListener('seeked', handler);
            eVideo.removeEventListener('timeupdate', handler);
            return;
        }

        const now = parseInt(eProgressBar.getAttribute('aria-valuenow'));
        const max = parseInt(eProgressBar.getAttribute('aria-valuemax'));
        const eps = 5;
        const delta = Math.abs(max - now);
        eMessage.textContent = (delta > eps) ? makeLagMessage(delta) : '';
    };

    eVideo.addEventListener('play', handler);
    eVideo.addEventListener('seeked', handler);
    eVideo.addEventListener('timeupdate', handler);

    return true;
};

const main = () => {
    if (!_main()) {
        setTimeout(main, 1000);
    }
};

if (document.readyState !== 'complete') {
    document.addEventListener('readystatechange', main);
} else {
    main();
}
