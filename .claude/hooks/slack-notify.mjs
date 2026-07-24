// Claude Code 훅에서 호출되는 Slack 알림 스크립트.
// 사용법: node slack-notify.mjs <notification|stop>  (훅 입력 JSON은 stdin으로 전달됨)
// 비밀값(SLACK_WEBHOOK_URL)은 이 파일에 하드코딩하지 않고 환경변수로만 읽는다 — 이 파일은 git에 커밋됨.
import https from 'node:https';

const eventType = process.argv[2] || 'unknown';
const webhook = process.env.SLACK_WEBHOOK_URL;

let raw = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', (chunk) => (raw += chunk));
process.stdin.on('end', () => {
  let data = {};
  try {
    data = JSON.parse(raw);
  } catch {
    // 훅 입력이 비어있거나 JSON이 아니어도 알림 전송은 계속 시도한다.
  }

  const project = (data.cwd || process.cwd()).split(/[\\/]/).filter(Boolean).pop();
  const time = new Date().toLocaleString('ko-KR');

  let text = null;
  if (eventType === 'notification') {
    const message = data.message || '';
    // 권한 요청 알림만 필터링해서 보낸다 (60초 이상 대기 등 다른 Notification은 제외).
    if (!/permission/i.test(message)) {
      process.exit(0);
    }
    text = `🔔 [Claude Code] 권한 요청\n프로젝트: ${project}\n메시지: ${message}\n시각: ${time}`;
  } else if (eventType === 'stop') {
    text = `✅ [Claude Code] 작업 완료\n프로젝트: ${project}\n시각: ${time}`;
  }

  if (!text || !webhook) {
    process.exit(0);
  }

  sendToSlack(webhook, text);
});

function sendToSlack(webhookUrl, text) {
  const payload = JSON.stringify({ text });

  let url;
  try {
    url = new URL(webhookUrl);
  } catch {
    // SLACK_WEBHOOK_URL이 아직 발급받은 URL로 교체되지 않은 경우(플레이스홀더 등) 조용히 종료한다.
    process.exit(0);
  }

  const req = https.request(
    url,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload),
      },
    },
    (res) => {
      res.resume();
      res.on('end', () => process.exit(0));
    }
  );

  // 네트워크 오류가 세션 진행을 막지 않도록 조용히 종료한다.
  req.on('error', () => process.exit(0));
  req.setTimeout(5000, () => {
    req.destroy();
    process.exit(0);
  });

  req.write(payload);
  req.end();
}
