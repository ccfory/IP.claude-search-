'use strict';
// The practice owns no game state; opening it only pauses the existing clock via modal.open.
const TUTORIAL_SEEN = 'ipcheck-tutorial-v1';
let tutorialSession = null;
function tutorialSeen() {
  try { return localStorage.getItem(TUTORIAL_SEEN) === 'done'; } catch { return false; }
}
function openTutorial(onExit = closeDialog) {
  tutorialSession = { step: 0, investigated: false, selected: false, verdict: '', onExit };
  renderTutorial();
}
function finishTutorial() {
  if (!tutorialSession) return;
  const proceed = tutorialSession.onExit;
  tutorialSession = null;
  try { localStorage.setItem(TUTORIAL_SEEN, 'done'); } catch {}
  proceed();
}
function tutorialVerdict(value) {
  if (!tutorialSession || tutorialSession.step !== 3 || !['out', 'cn', 'hold'].includes(value)) return;
  tutorialSession.verdict = value;
  renderTutorial();
  $(value === 'hold' ? 'tutorial-next' : 'tutorial-feedback').focus();
}
function renderTutorial() {
  const s = tutorialSession;
  if (!s) return;
  const titles = [
    t('先练一份，再正式值班。', 'Practice before your first shift.'),
    t('第一步：调查并调取材料。', 'Step 1: retrieve the records.'),
    t('第二步：选择判定依据。', 'Step 2: select your evidence.'),
    t('第三步：作出审核决定。', 'Step 3: make a finding.'),
    t('准备好开始值班了。', 'You are ready for duty.')
  ];
  const steps = [t('认识工位', 'Desk'), t('调查', 'Investigate'), t('选依据', 'Evidence'), t('盖章', 'Stamp'), t('完成', 'Ready')];
  const record = `<div class="tutorial-record"><span>${t('练习档案 · 虚构', 'PRACTICE FILE · FICTIONAL')}</span><h3>${t('一份证据尚不完整的申请', 'An application with missing records')}</h3><p>${t('申请人自称在受支持地区使用个人账号。设备语言为中文，出口节点显示另一地区；实际接入与账号使用记录尚未送达。', 'The applicant claims personal-account use in a supported location. Their device language is Chinese and the exit node shows another region. Actual-access and account-use records have not arrived.')}</p></div>`;
  const evidenceCard = `<button id="tutorial-evidence" class="tutorial-evidence ${s.selected ? 'selected' : ''}" aria-pressed="${s.selected}"><span>${t('无法核验', 'UNKNOWN')}</span><strong>${t('核验回执：关键记录缺失', 'Verification receipt: key records missing')}</strong><p>${t('无法确认实际接入地区与账号使用情况，需要补充材料并人工核验。', 'Actual access location and account use cannot be confirmed. More records and human review are needed.')}</p><small>${s.selected ? t('✓ 已选为依据', '✓ Selected as evidence') : t('点击选择这份材料', 'Select this record')}</small></button>`;
  let content = '';
  if (s.step === 0) content = `<p>${t('你是夜班审查员 Claude。先看申请，再调查；选出支持结论的材料，最后盖章。', 'You are Claude, the night review officer. Read the application, investigate, select supporting records, then stamp.')}</p><ol class="tutorial-overview"><li>${t('访客与桌面：阅读申请、自述和连接记录。虚线文字可标记线索，但标记不等于选中依据。', 'Visitor and desk: read the application, statements and connection log. Marking a dotted clue does not select evidence.')}</li><li>${t('调查台：调取接入与凭证，材料会出现在「核验材料」。', 'Investigation desk: retrieve access and verification records; they appear under Evidence.')}</li><li>${t('审核决定：根据有效证据，选择继续服务、限制访问或人工复核。', 'Disposition: use valid evidence to continue service, restrict access or request human review.')}</li></ol><p class="tutorial-note">${t('这是独立练习，不计时、不扣分，不改动你的正式存档。', 'This separate practice has no timer or score and does not change your saved run.')}</p>`;
  if (s.step === 1) content = record + `<p>${t('不要只凭语言、时区或出口节点下结论。先点击「核验凭证」，看看实际能拿到什么材料。', 'Language, timezone and the exit node cannot establish a finding alone. Select Verify records to see what is available.')}</p><button id="tutorial-investigate" class="primary" ${s.investigated ? 'disabled' : ''}>${s.investigated ? t('✓ 核验完成', '✓ Records checked') : t('核验凭证（练习免费）', 'Verify records (free practice)')}</button>${s.investigated ? '<div class="tutorial-note" role="status">' + t('回执已送达：关键记录缺失。下一步把这份回执选为依据。正式游戏每项调查扣 5 分。', 'Receipt received: key records are missing. Next, select this receipt as evidence. In the real game each inquiry costs 5 points.') + '</div>' : ''}`;
  if (s.step === 2) content = `<p>${t('点击回执，把它选为判定依据。正式游戏最多选两项；遇到交叉核验时，两份互补材料都要选。', 'Select the receipt as evidence. The real game allows up to two records; cross-checks need both complementary records.')}</p>` + evidenceCard + `<p class="tutorial-note" role="status">${s.selected ? t('已选 1 项，可以进入盖章练习。再点一次可以取消选择。', 'One record selected. You can now practice stamping. Select it again to deselect.') : t('先选择材料，才能继续。', 'Select a record to continue.')}</p>`;
  if (s.step === 3) content = `<div class="tutorial-note"><b>${t('已选依据：关键记录缺失', 'SELECTED: KEY RECORDS MISSING')}</b><p>${t('当前资料既不能确认符合资格，也不能证实违规。哪枚章符合这些证据？', 'The available records establish neither eligibility nor a breach. Which stamp fits the evidence?')}</p></div><div class="tutorial-verdicts"><button class="secondary" data-tutorial-verdict="out">A · ${t('继续服务', 'Continue')}</button><button class="secondary" data-tutorial-verdict="cn">D · ${t('限制访问', 'Restrict')}</button><button class="secondary" data-tutorial-verdict="hold">S · ${t('人工复核', 'Human review')}</button></div><p id="tutorial-feedback" class="tutorial-note" role="status" tabindex="-1">${s.verdict === 'hold' ? t('✓ 正确。缺失关键材料时，应保留原件、补充材料，交人工复核。', '✓ Correct. Preserve the originals, request missing records and refer for human review.') : s.verdict ? t('再试一次：记录不足以确认资格，也不足以证实违规，应选择人工复核。练习不会扣分。', 'Try again: the records establish neither eligibility nor a breach. Choose human review. Practice costs no points.') : t('点击一枚章试试看；练习中的决定不会提交到正式档案。', 'Try a stamp. Practice decisions are never submitted to your real case.')}</p>`;
  if (s.step === 4) content = `<p>${t('你已经完成「调查 → 选依据 → 盖章」。正式游戏中，先看完整材料，再判断内容、时间、持有人和撤销／更正状态。', 'You completed Investigate → Evidence → Stamp. In the real game, read the full records and check content, timestamps, holder, revocations and corrections.')}</p><ul class="tutorial-overview"><li>${t('正确结论 +80，依据充分再 +20；每项调查 −5，四次失误结束。', 'Correct finding +80, full evidence +20; each inquiry −5. Four mistakes end the run.')}</li><li>${t('新玩家建议选择「从容值班」。阅读对话框时，限时模式也会停表。', 'Start with Unhurried mode. Dialogs also pause the clock in Timed mode.')}</li><li>${t('电脑：1 / 2 / 3 调查，A / D / S 盖章。手机：用底部导航切换资料、材料与调查台。', 'Desktop: 1 / 2 / 3 investigate; A / D / S stamp. Mobile: use the bottom navigation for files, evidence and investigation.')}</li><li>${t('随时点击顶部「新手指引」重新练习，或打开「值班手册」查规则。', 'Use Beginner guide in the header to practice again, or Handbook to check the rules.')}</li></ul>`;
  const canNext = s.step === 0 || (s.step === 1 && s.investigated) || (s.step === 2 && s.selected) || (s.step === 3 && s.verdict === 'hold');
  const progress = `<ol class="tutorial-progress" aria-label="${t('指引进度', 'Guide progress')}">${steps.map((label, i) => `<li ${i === s.step ? 'aria-current="step"' : ''}><span>${i + 1}</span>${label}</li>`).join('')}</ol>`;
  openDialog(body('CLAUDE / 008 · ' + t('新手指引', 'BEGINNER GUIDE'), titles[s.step], progress + content + `<div class="tutorial-navigation"><button id="tutorial-back" class="secondary" ${s.step === 0 ? 'disabled' : ''}>${t('上一步', 'Back')}</button><button id="tutorial-next" class="primary" ${s.step !== 4 && !canNext ? 'disabled' : ''}>${s.step === 4 ? t('完成指引 →', 'Finish guide →') : t('下一步 →', 'Next →')}</button></div><button id="tutorial-skip" class="tutorial-skip">${t('跳过指引，返回游戏', 'Skip guide and return to the game')}</button>`), 'tutorial', renderTutorial);
  $('tutorial-back').onclick = () => { if (s.step > 0) { s.step--; renderTutorial(); } };
  $('tutorial-next').onclick = () => { if (s.step === 4) finishTutorial(); else if (canNext) { s.step++; renderTutorial(); } };
  $('tutorial-skip').onclick = finishTutorial;
  if (s.step === 1) $('tutorial-investigate').onclick = () => { s.investigated = true; renderTutorial(); $('tutorial-next').focus(); };
  if (s.step === 2) $('tutorial-evidence').onclick = () => { s.selected = !s.selected; renderTutorial(); $('tutorial-evidence').focus(); };
  if (s.step === 3) $('modal-content').querySelectorAll('[data-tutorial-verdict]').forEach(button => {
    button.onclick = () => tutorialVerdict(button.dataset.tutorialVerdict);
  });
  $('modal-content').querySelector('button:not(.dialog-language):not(:disabled)')?.focus();
}
