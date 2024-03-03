console.debug = ()=>{};

console.debug('content_script: enter');

const _main = () => {
    const eVideo = document.querySelector('video.video-stream');
    const eProgressBar = document.querySelector('.ytp-progress-bar');
    const eLiveBadge = document.querySelector('.ytp-live-badge');
    const eChatContainer = document.querySelector('#chat-container');

    if (eVideo === null || eProgressBar === null || eLiveBadge === null || eChatContainer === null) {
        console.debug('_main: return false (want to retry)');
        return false;
    }

    const eMessage = document.createElement('div');
    eMessage.style.cssText = 'color: red; font-size: 16px;';
    eChatContainer.parentNode.insertBefore(eMessage, eChatContainer.nextSibling);

    const makeLagMessage = (s) => `リアルタイムから${s}秒ズレています。`;
    const handler = () => {
        if (window.getComputedStyle(document.querySelector('.ytp-live-badge')).display === 'none') {
            console.debug('handler: return (stream archive)');
            eMessage.textContent = '';
            return;
        }
        if (eProgressBar.getAttribute('draggable') === null) {
            console.debug('handler: return (non DVR mode)');
            eMessage.textContent = '';
            return;
        }

        const now = parseInt(eProgressBar.getAttribute('aria-valuenow'));
        const max = parseInt(eProgressBar.getAttribute('aria-valuemax'));
        const eps = 5;
        const delta = Math.abs(max - now);
        eMessage.textContent = (delta > eps) ? makeLagMessage(delta) : '';
    };

    eVideo.addEventListener('seeked', handler);
    eVideo.addEventListener('timeupdate', handler);

    console.debug('_main: return true (started)');
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
