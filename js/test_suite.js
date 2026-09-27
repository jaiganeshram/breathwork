const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');

const ids = [
    'breathSphere', 'phaseText', 'secondsText', 'cycleText', 'totalTime', 'progressBar',
    'pattern', 'duration', 'ambientSound', 'bellSound',
    'techniqueInfo', 'techniqueBadge', 'customPattern', 'nostrilGuide', 'nostrilLeft', 'nostrilRight', 'mettaGuide', 'visGuide', 'visIcon', 'chakraGuide',
    'startBtn', 'pauseBtn', 'resetBtn', 'mindBtn',
    'ratingModal', 'saveRatingBtn', 'guideModal', 'guideBtn', 'closeGuideBtn',
    'zenBtn', 'zenExitBtn', 'themeBtn', 'fullscreenBtn',
    'history', 'historyActions', 'toggleAllGroupsBtn', 'clearHistoryBtn', 'exportCsvBtn',
    'todaySessions', 'totalMinutes', 'totalSessions', 'avgCalm', 'totalWanders', 'streakBadge',
    'badge1', 'badge2', 'badge3', 'badge4', 'badge5',
    'firebaseModal', 'modalAuthStatus', 'fbInputSmartPaste', 'firebaseSyncBadge', 'firebaseAuthBtn'
];

const missing = ids.filter(id => !html.includes(`id="${id}"`) && !html.includes(`id='${id}'`));
console.log('Missing IDs count:', missing.length);
if (missing.length > 0) {
    console.error('Missing IDs in index.html:', missing);
} else {
    console.log('✅ ALL DOM ELEMENT IDS ARE PRESENT IN INDEX.HTML!');
}
