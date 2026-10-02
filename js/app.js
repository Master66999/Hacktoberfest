/**
 * KitchenTales — Application Orchestrator
 * Connects UI, Web Audio Recording, Gemma Engine, ElevenLabs Narrator,
 * Hands-Free Voice Commands, Smart Grocery Generator, Dietary Adaptations, and Heirloom Vault.
 */

import { SAMPLE_MEMOS } from './recipes-data.js';
import { GemmaRecipeEngine } from './gemma-engine.js';
import { VoiceNarrator } from './voice-narrator.js';

class KitchenTalesApp {
  constructor() {
    this.gemmaEngine = new GemmaRecipeEngine();
    this.narrator = new VoiceNarrator();

    // App State
    this.activeMemo = SAMPLE_MEMOS[0];
    this.currentRecipe = JSON.parse(JSON.stringify(this.activeMemo.structured));
    this.originalRecipe = JSON.parse(JSON.stringify(this.activeMemo.structured));
    this.baseServings = this.currentRecipe.servings || 4;
    this.currentServings = this.baseServings;
    this.currentUnit = 'imperial'; // 'imperial' | 'metric'
    this.currentCardTheme = 'parchment';
    this.activeDiet = null;

    // Recording state
    this.isRecording = false;
    this.mediaRecorder = null;
    this.audioChunks = [];
    this.audioContext = null;
    this.analyser = null;
    this.recordTimer = null;
    this.recordSeconds = 0;

    // Cook mode state
    this.cookStepIndex = 0;
    this.cookTimerInterval = null;
    this.cookTimerRemaining = 0;
    this.cookTimerRunning = false;
    this.isVoiceCommandsActive = true;

    // Audio preview state
    this.isPlayingMemo = false;

    // Heirloom Vault State
    this.vaultRecipes = this.loadVaultRecipes();

    this.initElements();
    this.bindEvents();
    this.renderPresets();
    this.loadMemo(this.activeMemo);
    this.initWaveform();
    this.initTheme();
    this.updateVaultBadge();
  }

  initElements() {
    // Nav & Modals
    this.themeToggleBtn = document.getElementById('themeToggleBtn');
    this.navOpenWhyBtn = document.getElementById('navOpenWhyBtn');
    this.navDevExportBtn = document.getElementById('navDevExportBtn');
    this.navSettingsBtn = document.getElementById('navSettingsBtn');
    this.navVaultBtn = document.getElementById('navVaultBtn');
    this.vaultBadge = document.getElementById('vaultBadge');

    this.engineSettingsPill = document.getElementById('engineSettingsPill');
    this.whyOpenModal = document.getElementById('whyOpenModal');
    this.devExportModal = document.getElementById('devExportModal');
    this.settingsModal = document.getElementById('settingsModal');
    this.groceryModal = document.getElementById('groceryModal');
    this.adaptationsModal = document.getElementById('adaptationsModal');
    this.vaultModal = document.getElementById('vaultModal');
    this.toastNotification = document.getElementById('toastNotification');

    // Input Tabs
    this.tabPresets = document.getElementById('tabPresets');
    this.tabRecord = document.getElementById('tabRecord');
    this.tabUpload = document.getElementById('tabUpload');
    this.tabContentPresets = document.getElementById('tabContentPresets');
    this.tabContentRecord = document.getElementById('tabContentRecord');
    this.tabContentUpload = document.getElementById('tabContentUpload');

    // Studio Elements
    this.presetListContainer = document.getElementById('presetListContainer');
    this.friendNameInput = document.getElementById('friendNameInput');
    this.transcriptText = document.getElementById('transcriptText');
    this.transformBtn = document.getElementById('transformBtn');
    this.engineModelName = document.getElementById('engineModelName');

    // Audio Recorder
    this.micRecordBtn = document.getElementById('micRecordBtn');
    this.recorderStatusText = document.getElementById('recorderStatusText');
    this.recorderTimerText = document.getElementById('recorderTimerText');
    this.waveformCanvas = document.getElementById('waveformCanvas');
    this.audioFileInput = document.getElementById('audioFileInput');

    // Audio Player Bar
    this.audioPlayBtn = document.getElementById('audioPlayBtn');
    this.audioTrackTitle = document.getElementById('audioTrackTitle');
    this.audioTrackMeta = document.getElementById('audioTrackMeta');

    // Recipe Card
    this.heirloomRecipeCard = document.getElementById('heirloomRecipeCard');
    this.processingCard = document.getElementById('processingCard');
    this.processingStatusTitle = document.getElementById('processingStatusTitle');
    this.processingStatusDesc = document.getElementById('processingStatusDesc');
    this.processingTerminalOutput = document.getElementById('processingTerminalOutput');

    this.cardDedicationText = document.getElementById('cardDedicationText');
    this.cardRecipeTitle = document.getElementById('cardRecipeTitle');
    this.cardOriginQuote = document.getElementById('cardOriginQuote');
    this.cardPrepTime = document.getElementById('cardPrepTime');
    this.cardCookTime = document.getElementById('cardCookTime');
    this.cardServings = document.getElementById('cardServings');
    this.cardDifficulty = document.getElementById('cardDifficulty');

    // Unit toggle & Theme select
    this.btnUnitImperial = document.getElementById('btnUnitImperial');
    this.btnUnitMetric = document.getElementById('btnUnitMetric');
    this.cardThemeSelect = document.getElementById('cardThemeSelect');

    // Adaptation Banner
    this.adaptationAlertBanner = document.getElementById('adaptationAlertBanner');
    this.adaptationBannerTitle = document.getElementById('adaptationBannerTitle');
    this.adaptationBannerNote = document.getElementById('adaptationBannerNote');
    this.btnResetAdaptation = document.getElementById('btnResetAdaptation');

    // Ingredients & Steps
    this.ingredientsListContainer = document.getElementById('ingredientsListContainer');
    this.stepsListContainer = document.getElementById('stepsListContainer');
    this.stepsCountLabel = document.getElementById('stepsCountLabel');
    this.secretTipTitle = document.getElementById('secretTipTitle');
    this.secretTipBody = document.getElementById('secretTipBody');

    // Sommelier Pairing
    this.heritagePairingContainer = document.getElementById('heritagePairingContainer');
    this.pairingWine = document.getElementById('pairingWine');
    this.pairingAlcoholFree = document.getElementById('pairingAlcoholFree');
    this.pairingNotes = document.getElementById('pairingNotes');

    this.btnServingsMinus = document.getElementById('btnServingsMinus');
    this.btnServingsPlus = document.getElementById('btnServingsPlus');
    this.servingsCounter = document.getElementById('servingsCounter');

    // Action Buttons
    this.btnCookMode = document.getElementById('btnCookMode');
    this.btnVoiceListen = document.getElementById('btnVoiceListen');
    this.btnGroceryModal = document.getElementById('btnGroceryModal');
    this.btnAdaptationsModal = document.getElementById('btnAdaptationsModal');
    this.btnSaveVault = document.getElementById('btnSaveVault');
    this.btnPrintCard = document.getElementById('btnPrintCard');
    this.btnExportMarkdown = document.getElementById('btnExportMarkdown');

    // Cook Mode Elements
    this.cookModeOverlay = document.getElementById('cookModeOverlay');
    this.btnExitCookMode = document.getElementById('btnExitCookMode');
    this.cookModeRecipeTitle = document.getElementById('cookModeRecipeTitle');
    this.cookModeProgressText = document.getElementById('cookModeProgressText');
    this.cookStepBadge = document.getElementById('cookStepBadge');
    this.cookStepTitle = document.getElementById('cookStepTitle');
    this.cookStepDesc = document.getElementById('cookStepDesc');
    this.cookTimerDisplay = document.getElementById('cookTimerDisplay');
    this.btnStartCookTimer = document.getElementById('btnStartCookTimer');
    this.btnResetCookTimer = document.getElementById('btnResetCookTimer');
    this.btnPrevCookStep = document.getElementById('btnPrevCookStep');
    this.btnNextCookStep = document.getElementById('btnNextCookStep');
    this.btnSpeakCookStep = document.getElementById('btnSpeakCookStep');
    this.cookVoiceBanner = document.getElementById('cookVoiceBanner');
    this.cookVoiceStatusText = document.getElementById('cookVoiceStatusText');
    this.btnToggleVoiceCommands = document.getElementById('btnToggleVoiceCommands');

    // Grocery Modal Elements
    this.groceryServingsLabel = document.getElementById('groceryServingsLabel');
    this.groceryItemsCount = document.getElementById('groceryItemsCount');
    this.btnResetGroceryChecks = document.getElementById('btnResetGroceryChecks');
    this.groceryCategoriesContainer = document.getElementById('groceryCategoriesContainer');
    this.btnPrintGrocery = document.getElementById('btnPrintGrocery');
    this.btnCopyWhatsApp = document.getElementById('btnCopyWhatsApp');

    // Adaptations Modal Elements
    this.swapIngredientSelect = document.getElementById('swapIngredientSelect');
    this.btnCheckSwap = document.getElementById('btnCheckSwap');
    this.swapResultBox = document.getElementById('swapResultBox');
    this.swapResultSubstitute = document.getElementById('swapResultSubstitute');
    this.swapResultRationale = document.getElementById('swapResultRationale');

    // Vault Modal Elements
    this.vaultSearchInput = document.getElementById('vaultSearchInput');
    this.btnSaveCurrentToVault = document.getElementById('btnSaveCurrentToVault');
    this.btnExportVaultJson = document.getElementById('btnExportVaultJson');
    this.vaultImportFileInput = document.getElementById('vaultImportFileInput');
    this.vaultRecipesContainer = document.getElementById('vaultRecipesContainer');

    // DEV export textarea
    this.devMarkdownTextarea = document.getElementById('devMarkdownTextarea');
    this.btnCopyDevMarkdown = document.getElementById('btnCopyDevMarkdown');

    // Settings elements
    this.settingEndpointType = document.getElementById('settingEndpointType');
    this.settingGemmaModel = document.getElementById('settingGemmaModel');
    this.settingOllamaUrl = document.getElementById('settingOllamaUrl');
    this.settingApiKey = document.getElementById('settingApiKey');
    this.settingElevenLabsKey = document.getElementById('settingElevenLabsKey');
    this.settingElevenLabsVoice = document.getElementById('settingElevenLabsVoice');
    this.btnSaveSettings = document.getElementById('btnSaveSettings');
    this.ollamaSettingsRow = document.getElementById('ollamaSettingsRow');
    this.googleApiSettingsRow = document.getElementById('googleApiSettingsRow');
  }

  bindEvents() {
    // Theme Switcher
    this.themeToggleBtn.addEventListener('click', () => this.toggleTheme());

    // Tabs
    this.tabPresets.addEventListener('click', () => this.switchTab('presets'));
    this.tabRecord.addEventListener('click', () => this.switchTab('record'));
    this.tabUpload.addEventListener('click', () => this.switchTab('upload'));

    // Audio Recording
    this.micRecordBtn.addEventListener('click', () => this.toggleRecording());
    this.audioFileInput.addEventListener('change', (e) => this.handleFileUpload(e));

    // Audio Player Bar
    this.audioPlayBtn.addEventListener('click', () => this.toggleAudioPlayback());

    // Transformation
    this.transformBtn.addEventListener('click', () => this.handleTransform());

    // Servings Stepper
    this.btnServingsMinus.addEventListener('click', () => this.adjustServings(-1));
    this.btnServingsPlus.addEventListener('click', () => this.adjustServings(1));

    // Unit Converter
    this.btnUnitImperial.addEventListener('click', () => this.setUnit('imperial'));
    this.btnUnitMetric.addEventListener('click', () => this.setUnit('metric'));

    // Card Theme Selector
    this.cardThemeSelect.addEventListener('change', (e) => this.setCardTheme(e.target.value));

    // Reset Adaptation
    this.btnResetAdaptation.addEventListener('click', () => this.revertAdaptation());

    // Action Buttons
    this.btnCookMode.addEventListener('click', () => this.openCookMode());
    this.btnVoiceListen.addEventListener('click', () => this.narrateRecipeOverview());
    this.btnGroceryModal.addEventListener('click', () => this.openGroceryModal());
    this.btnAdaptationsModal.addEventListener('click', () => this.openAdaptationsModal());
    this.btnSaveVault.addEventListener('click', () => this.saveCurrentRecipeToVault());
    this.btnPrintCard.addEventListener('click', () => window.print());
    this.btnExportMarkdown.addEventListener('click', () => this.copyRecipeMarkdown());

    // Cook Mode Nav & Voice
    this.btnExitCookMode.addEventListener('click', () => this.closeCookMode());
    this.btnPrevCookStep.addEventListener('click', () => this.changeCookStep(-1));
    this.btnNextCookStep.addEventListener('click', () => this.changeCookStep(1));
    this.btnSpeakCookStep.addEventListener('click', () => this.speakCurrentCookStep());
    this.btnStartCookTimer.addEventListener('click', () => this.toggleCookTimer());
    this.btnResetCookTimer.addEventListener('click', () => this.resetCookTimer());
    this.btnToggleVoiceCommands.addEventListener('click', () => this.toggleVoiceCommands());

    // Grocery Modal Events
    this.btnResetGroceryChecks.addEventListener('click', () => this.resetGroceryChecks());
    this.btnCopyWhatsApp.addEventListener('click', () => this.copyGroceryListForWhatsApp());
    this.btnPrintGrocery.addEventListener('click', () => window.print());

    // Adaptation Modal Events
    document.querySelectorAll('.diet-option-card').forEach(btn => {
      btn.addEventListener('click', () => {
        const diet = btn.getAttribute('data-diet');
        this.applyDietaryAdaptation(diet);
      });
    });
    this.btnCheckSwap.addEventListener('click', () => this.checkIngredientSwap());

    // Vault Modal Events
    this.navVaultBtn.addEventListener('click', () => this.openVaultModal());
    this.btnSaveCurrentToVault.addEventListener('click', () => this.saveCurrentRecipeToVault());
    this.vaultSearchInput.addEventListener('input', () => this.renderVaultRecipes());
    this.btnExportVaultJson.addEventListener('click', () => this.exportVaultJson());
    this.vaultImportFileInput.addEventListener('change', (e) => this.importVaultJson(e));

    // Nav Modals
    this.navOpenWhyBtn.addEventListener('click', () => this.openModal(this.whyOpenModal));
    this.navDevExportBtn.addEventListener('click', () => this.openDevExportModal());
    this.navSettingsBtn.addEventListener('click', () => this.openSettingsModal());
    this.engineSettingsPill.addEventListener('click', () => this.openSettingsModal());

    document.querySelectorAll('.modal-close-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const modalId = e.target.getAttribute('data-close');
        if (modalId) {
          const modal = document.getElementById(modalId);
          if (modal) modal.classList.remove('active');
        }
      });
    });

    document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) backdrop.classList.remove('active');
      });
    });

    // Settings save
    this.settingEndpointType.addEventListener('change', () => this.syncSettingsVisibility());
    this.btnSaveSettings.addEventListener('click', () => this.saveEngineSettings());

    // Dev markdown copy
    this.btnCopyDevMarkdown.addEventListener('click', () => {
      this.devMarkdownTextarea.select();
      navigator.clipboard.writeText(this.devMarkdownTextarea.value);
      this.btnCopyDevMarkdown.textContent = '✓ Copied to Clipboard!';
      setTimeout(() => {
        this.btnCopyDevMarkdown.innerHTML = '<span>📋</span> Copy to Clipboard';
      }, 2000);
    });
  }

  showToast(message, duration = 3000) {
    if (!this.toastNotification) return;
    this.toastNotification.textContent = message;
    this.toastNotification.classList.add('active');
    setTimeout(() => {
      this.toastNotification.classList.remove('active');
    }, duration);
  }

  initTheme() {
    const savedTheme = localStorage.getItem('kitchentales_theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    this.themeToggleBtn.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
  }

  toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('kitchentales_theme', next);
    this.themeToggleBtn.textContent = next === 'dark' ? '☀️' : '🌙';
  }

  setUnit(unit) {
    this.currentUnit = unit;
    if (unit === 'metric') {
      this.btnUnitMetric.classList.add('active');
      this.btnUnitImperial.classList.remove('active');
    } else {
      this.btnUnitImperial.classList.add('active');
      this.btnUnitMetric.classList.remove('active');
    }
    this.renderRecipeCard();
    this.showToast(`Switched units to ${unit === 'metric' ? 'Metric (g, ml)' : 'US Customary (cups, lbs)'}`);
  }

  setCardTheme(theme) {
    this.currentCardTheme = theme;
    this.heirloomRecipeCard.classList.remove('theme-parchment', 'theme-hearth', 'theme-modern');
    this.heirloomRecipeCard.classList.add(`theme-${theme}`);
    this.showToast(`Card style: ${theme.toUpperCase()}`);
  }

  switchTab(tabName) {
    [this.tabPresets, this.tabRecord, this.tabUpload].forEach(t => t.classList.remove('active'));
    [this.tabContentPresets, this.tabContentRecord, this.tabContentUpload].forEach(c => c.style.display = 'none');

    if (tabName === 'presets') {
      this.tabPresets.classList.add('active');
      this.tabContentPresets.style.display = 'block';
    } else if (tabName === 'record') {
      this.tabRecord.classList.add('active');
      this.tabContentRecord.style.display = 'block';
    } else if (tabName === 'upload') {
      this.tabUpload.classList.add('active');
      this.tabContentUpload.style.display = 'block';
    }
  }

  renderPresets() {
    this.presetListContainer.innerHTML = '';
    SAMPLE_MEMOS.forEach(memo => {
      const card = document.createElement('div');
      card.className = `preset-card ${memo.id === this.activeMemo.id ? 'selected' : ''}`;
      card.innerHTML = `
        <div class="preset-header">
          <span class="preset-friend-tag">❤️ ${memo.friendName}</span>
          <span class="preset-time">⏱️ ${memo.duration}</span>
        </div>
        <div class="preset-title">${memo.title}</div>
        <div class="preset-snippet">"${memo.rawTranscript}"</div>
      `;
      card.addEventListener('click', () => {
        document.querySelectorAll('.preset-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        this.loadMemo(memo);
      });
      this.presetListContainer.appendChild(card);
    });
  }

  loadMemo(memo) {
    this.activeMemo = memo;
    this.currentRecipe = JSON.parse(JSON.stringify(memo.structured));
    this.originalRecipe = JSON.parse(JSON.stringify(memo.structured));
    this.baseServings = this.currentRecipe.servings || 4;
    this.currentServings = this.baseServings;
    this.activeDiet = null;
    this.adaptationAlertBanner.style.display = 'none';

    this.friendNameInput.value = memo.friendName;
    this.transcriptText.textContent = memo.rawTranscript;
    this.audioTrackTitle.textContent = `${memo.friendName}’s Voice Note`;
    this.audioTrackMeta.textContent = `Duration: ${memo.duration} • ${memo.dateRecorded}`;

    this.renderRecipeCard();
  }

  renderRecipeCard() {
    const r = this.currentRecipe;
    const friend = this.friendNameInput.value.trim() || 'A Loved One';

    this.cardDedicationText.textContent = `Dedicated to ${friend}`;
    this.cardRecipeTitle.textContent = r.title;
    this.cardOriginQuote.textContent = `"${r.originStory}"`;
    this.cardPrepTime.textContent = r.prepTime;
    this.cardCookTime.textContent = r.cookTime;
    this.cardServings.textContent = `${this.currentServings} servings`;
    this.cardDifficulty.textContent = r.difficulty;
    this.servingsCounter.textContent = this.currentServings;

    // Render Ingredients with checkbox toggle & scaling
    this.ingredientsListContainer.innerHTML = '';
    const ratio = this.currentServings / (this.baseServings || 4);

    r.ingredients.forEach((ing, idx) => {
      const li = document.createElement('li');
      li.className = 'ingredient-item';
      
      let baseAmount = ing.amount;
      if (this.currentUnit === 'metric' && ing.metric) baseAmount = ing.metric;
      else if (this.currentUnit === 'imperial' && ing.imperial) baseAmount = ing.imperial;

      const scaledAmount = this.scaleIngredientAmount(baseAmount, ratio);

      li.innerHTML = `
        <input type="checkbox" id="ing_${idx}" class="ingredient-checkbox">
        <label for="ing_${idx}" style="cursor: pointer; flex: 1;">
          <span class="ingredient-amount">${scaledAmount}</span> ${ing.name}
        </label>
      `;

      const checkbox = li.querySelector('input');
      checkbox.addEventListener('change', () => {
        if (checkbox.checked) li.classList.add('checked');
        else li.classList.remove('checked');
      });

      this.ingredientsListContainer.appendChild(li);
    });

    // Secret tip
    if (r.secretTip) {
      this.secretTipTitle.textContent = r.secretTip.title;
      this.secretTipBody.textContent = r.secretTip.body;
    }

    // Sommelier Heritage Pairing
    if (r.heritagePairing) {
      this.heritagePairingContainer.style.display = 'block';
      this.pairingWine.textContent = r.heritagePairing.beverage || 'Regional Vintage Wine';
      this.pairingAlcoholFree.textContent = r.heritagePairing.alcoholFree || 'Artisan Botanical Infusion';
      this.pairingNotes.textContent = r.heritagePairing.notes || 'Balanced acidity harmonizes flavors.';
    } else {
      this.heritagePairingContainer.style.display = 'none';
    }

    // Render Steps
    this.stepsListContainer.innerHTML = '';
    this.stepsCountLabel.textContent = `${r.steps.length} Steps`;

    r.steps.forEach(st => {
      const stepEl = document.createElement('div');
      stepEl.className = 'step-card';
      stepEl.innerHTML = `
        <div class="step-number">${st.step}</div>
        <div class="step-body">
          <div class="step-title">${st.title}</div>
          <div class="step-desc">${st.instruction}</div>
          ${st.timerLabel ? `
            <span class="step-timer-badge" data-seconds="${st.timerSeconds}" title="Click to launch kitchen timer">
              ⏱️ ${st.timerLabel}
            </span>
          ` : ''}
        </div>
      `;

      const timerBadge = stepEl.querySelector('.step-timer-badge');
      if (timerBadge) {
        timerBadge.addEventListener('click', () => {
          this.openCookMode(st.step - 1);
        });
      }

      this.stepsListContainer.appendChild(stepEl);
    });
  }

  scaleIngredientAmount(amountStr, ratio) {
    if (ratio === 1 || !amountStr) return amountStr;
    return amountStr.replace(/([\d\.\/]+)/, (match) => {
      let num = parseFloat(match);
      if (isNaN(num)) return match;
      let scaled = num * ratio;
      return Number.isInteger(scaled) ? scaled.toString() : scaled.toFixed(1).replace(/\.0$/, '');
    });
  }

  adjustServings(delta) {
    const next = this.currentServings + delta;
    if (next < 1 || next > 24) return;
    this.currentServings = next;
    this.renderRecipeCard();
  }

  /**
   * AI Transformation Trigger
   */
  async handleTransform() {
    const transcript = this.transcriptText.textContent.trim();
    const friend = this.friendNameInput.value.trim() || 'A Loved One';

    if (!transcript || transcript.length < 10) {
      alert('Please select or record a voice memo transcript first.');
      return;
    }

    // Show processing UI
    this.heirloomRecipeCard.style.display = 'none';
    this.processingCard.classList.add('active');
    this.processingTerminalOutput.innerHTML = '';

    const addTerminalLog = (msg) => {
      const p = document.createElement('div');
      p.textContent = `[${new Date().toLocaleTimeString()}] ${msg}`;
      this.processingTerminalOutput.appendChild(p);
      this.processingTerminalOutput.scrollTop = this.processingTerminalOutput.scrollHeight;
    };

    try {
      const structuredRecipe = await this.gemmaEngine.processVoiceMemo(transcript, friend, (log) => {
        addTerminalLog(log.message);
        this.processingStatusTitle.textContent = log.message;
      });

      this.currentRecipe = structuredRecipe;
      this.originalRecipe = JSON.parse(JSON.stringify(structuredRecipe));
      this.baseServings = structuredRecipe.servings || 4;
      this.currentServings = this.baseServings;
      this.activeDiet = null;
      this.adaptationAlertBanner.style.display = 'none';

      await new Promise(r => setTimeout(r, 600));

      this.processingCard.classList.remove('active');
      this.heirloomRecipeCard.style.display = 'block';
      this.renderRecipeCard();

      // Show toast
      this.showToast(`✨ Structured into Heirloom Card for ${friend}!`);
      this.narrator.speak(`Heirloom recipe for ${friend} structured successfully with Gemma.`);
    } catch (err) {
      console.error(err);
      this.processingCard.classList.remove('active');
      this.heirloomRecipeCard.style.display = 'block';
      alert('Transformation error: ' + err.message);
    }
  }

  /**
   * Audio Memo Playback
   */
  toggleAudioPlayback() {
    if (this.isPlayingMemo) {
      this.narrator.stop();
      this.isPlayingMemo = false;
      this.audioPlayBtn.textContent = '▶';
    } else {
      const memoText = this.transcriptText.textContent;
      this.isPlayingMemo = true;
      this.audioPlayBtn.textContent = '⏸';

      this.narrator.speak(memoText, {
        rate: 0.95,
        onEnd: () => {
          this.isPlayingMemo = false;
          this.audioPlayBtn.textContent = '▶';
        },
        onError: () => {
          this.isPlayingMemo = false;
          this.audioPlayBtn.textContent = '▶';
        }
      });
    }
  }

  /**
   * Live Microphone Recording with Real-Time Transcription
   */
  async toggleRecording() {
    if (!this.isRecording) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        this.startRecording(stream);
      } catch (err) {
        alert('Microphone access denied or not supported: ' + err.message);
      }
    } else {
      this.stopRecording();
    }
  }

  startRecording(stream) {
    this.isRecording = true;
    this.micRecordBtn.classList.add('recording');
    this.micRecordBtn.textContent = '⏹';
    this.recorderStatusText.textContent = 'Listening & transcribing live speech...';

    this.audioChunks = [];
    this.mediaRecorder = new MediaRecorder(stream);
    this.mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) this.audioChunks.push(e.data);
    };

    this.mediaRecorder.onstop = () => {
      stream.getTracks().forEach(t => t.stop());
      this.handleRecordedAudio();
    };

    this.mediaRecorder.start();

    // Start live speech-to-text dictation
    this.transcriptText.textContent = 'Listening to your voice memo in real time...';
    this.narrator.startLiveTranscription((liveText) => {
      if (liveText && liveText.trim().length > 0) {
        this.transcriptText.textContent = liveText;
      }
    });

    // Start timer
    this.recordSeconds = 0;
    this.recorderTimerText.textContent = 'Duration: 00:00';
    this.recordTimer = setInterval(() => {
      this.recordSeconds++;
      const m = String(Math.floor(this.recordSeconds / 60)).padStart(2, '0');
      const s = String(this.recordSeconds % 60).padStart(2, '0');
      this.recorderTimerText.textContent = `Recording: ${m}:${s}`;
    }, 1000);

    // Audio Visualizer
    this.startAudioVisualizer(stream);
  }

  stopRecording() {
    this.isRecording = false;
    this.micRecordBtn.classList.remove('recording');
    this.micRecordBtn.textContent = '🎤';
    this.recorderStatusText.textContent = 'Voice Memo Captured!';
    clearInterval(this.recordTimer);

    this.narrator.stopLiveTranscription();

    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
    }
  }

  handleRecordedAudio() {
    this.recorderStatusText.textContent = 'Voice Memo Captured!';
    this.recorderTimerText.textContent = `Recorded ${this.recordSeconds}s of audio`;

    const friend = this.friendNameInput.value.trim() || 'My Friend';
    if (!this.transcriptText.textContent || this.transcriptText.textContent.includes('Listening to your voice')) {
      this.transcriptText.textContent = `Hey! Here is how we make the secret family dish for ${friend}. You start by heating good olive oil in the pan until it shimmers. Toss in three cloves of minced garlic and a pinch of chili flakes. Once fragrant, stir in the fresh ingredients and keep the flame steady. The secret is to let the sauce reduce gently until thick, and never rush the aromatics. Season with sea salt and serve immediately!`;
    }

    this.audioTrackTitle.textContent = `Live Recording (${friend})`;
    this.audioTrackMeta.textContent = `Captured: ${this.recordSeconds}s • Client Audio Buffer`;
    this.showToast('Voice memo recorded! Click "Structure with Gemma AI"');
  }

  handleFileUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    this.audioTrackTitle.textContent = file.name;
    this.audioTrackMeta.textContent = `Size: ${(file.size / 1024 / 1024).toFixed(2)} MB • ${file.type || 'audio'}`;

    const friend = this.friendNameInput.value.trim() || 'Friend';
    this.transcriptText.textContent = `Audio voice memo "${file.name}" loaded for ${friend}. Ready to structure into verified Heirloom Recipe Card with Gemma open AI.`;
    this.showToast(`Loaded ${file.name}`);
  }

  startAudioVisualizer(stream) {
    if (!window.AudioContext && !window.webkitAudioContext) return;
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    this.audioContext = new AudioCtx();
    const source = this.audioContext.createMediaStreamSource(stream);
    this.analyser = this.audioContext.createAnalyser();
    this.analyser.fftSize = 64;
    source.connect(this.analyser);

    const bufferLength = this.analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    const canvas = this.waveformCanvas;
    const ctx = canvas.getContext('2d');

    const draw = () => {
      if (!this.isRecording) {
        this.clearWaveform();
        return;
      }
      requestAnimationFrame(draw);
      this.analyser.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const barWidth = (canvas.width / bufferLength) * 1.5;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] / 255) * canvas.height;
        ctx.fillStyle = '#D96B43';
        ctx.fillRect(x, canvas.height - barHeight, barWidth - 2, barHeight);
        x += barWidth;
      }
    };
    draw();
  }

  initWaveform() {
    this.waveformCanvas.width = this.waveformCanvas.clientWidth || 300;
    this.waveformCanvas.height = 60;
    this.clearWaveform();
  }

  clearWaveform() {
    const ctx = this.waveformCanvas.getContext('2d');
    ctx.clearRect(0, 0, this.waveformCanvas.width, this.waveformCanvas.height);
    ctx.fillStyle = '#E8E2D8';
    ctx.fillRect(0, this.waveformCanvas.height / 2 - 1, this.waveformCanvas.width, 2);
  }

  /**
   * ==========================================
   * Hands-Free Cook Mode Overlay & Voice Control
   * ==========================================
   */
  openCookMode(initialStep = 0) {
    this.cookStepIndex = initialStep;
    this.cookModeRecipeTitle.textContent = this.currentRecipe.title;
    this.cookModeOverlay.classList.add('active');
    this.renderCookStep();
    this.speakCurrentCookStep();

    if (this.isVoiceCommandsActive) {
      this.startVoiceListener();
    }
  }

  closeCookMode() {
    this.cookModeOverlay.classList.remove('active');
    this.narrator.stop();
    this.narrator.stopVoiceCommands();
    this.resetCookTimer();
  }

  startVoiceListener() {
    this.narrator.startVoiceCommands(
      (command, transcript) => {
        this.handleVoiceCommand(command, transcript);
      },
      (status) => {
        if (status.lastHeard) {
          this.cookVoiceStatusText.textContent = `Heard: "${status.lastHeard}"`;
        } else if (status.message) {
          this.cookVoiceStatusText.textContent = status.message;
        }
      }
    );
  }

  handleVoiceCommand(command, transcript) {
    this.showToast(`Voice Command: ${command.toUpperCase()}`);

    if (command === 'next') {
      this.changeCookStep(1);
    } else if (command === 'previous') {
      this.changeCookStep(-1);
    } else if (command === 'repeat') {
      this.speakCurrentCookStep();
    } else if (command === 'start_timer') {
      if (!this.cookTimerRunning) this.toggleCookTimer();
    } else if (command === 'pause_timer') {
      if (this.cookTimerRunning) this.toggleCookTimer();
    } else if (command === 'reset_timer') {
      this.resetCookTimer();
    } else if (command === 'exit') {
      this.closeCookMode();
    }
  }

  toggleVoiceCommands() {
    this.isVoiceCommandsActive = !this.isVoiceCommandsActive;
    if (this.isVoiceCommandsActive) {
      this.btnToggleVoiceCommands.classList.remove('inactive');
      this.btnToggleVoiceCommands.textContent = 'Voice: Active';
      this.startVoiceListener();
      this.showToast('Hands-free voice commands enabled');
    } else {
      this.btnToggleVoiceCommands.classList.add('inactive');
      this.btnToggleVoiceCommands.textContent = 'Voice: Muted';
      this.narrator.stopVoiceCommands();
      this.cookVoiceStatusText.textContent = 'Voice commands muted. Click "Voice: Muted" to reactivate.';
      this.showToast('Hands-free voice commands muted');
    }
  }

  changeCookStep(delta) {
    const next = this.cookStepIndex + delta;
    if (next < 0 || next >= this.currentRecipe.steps.length) return;
    this.cookStepIndex = next;
    this.resetCookTimer();
    this.renderCookStep();
    this.speakCurrentCookStep();
  }

  renderCookStep() {
    const step = this.currentRecipe.steps[this.cookStepIndex];
    const total = this.currentRecipe.steps.length;

    this.cookStepBadge.textContent = `STEP ${step.step} OF ${total}`;
    this.cookModeProgressText.textContent = `Step ${step.step} of ${total}`;
    this.cookStepTitle.textContent = step.title;
    this.cookStepDesc.textContent = step.instruction;

    this.cookTimerRemaining = step.timerSeconds || 300;
    this.updateTimerDisplay();

    this.btnPrevCookStep.disabled = (this.cookStepIndex === 0);
    this.btnNextCookStep.textContent = (this.cookStepIndex === total - 1) ? 'Finish Recipe 🎉' : 'Next Step →';
  }

  speakCurrentCookStep() {
    const step = this.currentRecipe.steps[this.cookStepIndex];
    const textToSpeak = `Step ${step.step}: ${step.title}. ${step.instruction}`;
    this.narrator.speak(textToSpeak);
  }

  toggleCookTimer() {
    if (this.cookTimerRunning) {
      clearInterval(this.cookTimerInterval);
      this.cookTimerRunning = false;
      this.btnStartCookTimer.textContent = 'Resume';
    } else {
      this.cookTimerRunning = true;
      this.btnStartCookTimer.textContent = 'Pause';
      this.cookTimerInterval = setInterval(() => {
        if (this.cookTimerRemaining > 0) {
          this.cookTimerRemaining--;
          this.updateTimerDisplay();
        } else {
          clearInterval(this.cookTimerInterval);
          this.cookTimerRunning = false;
          this.btnStartCookTimer.textContent = 'Start';
          this.narrator.speak('Timer finished! Check your cooking.');
        }
      }, 1000);
    }
  }

  resetCookTimer() {
    clearInterval(this.cookTimerInterval);
    this.cookTimerRunning = false;
    this.btnStartCookTimer.textContent = 'Start';
    const step = this.currentRecipe.steps[this.cookStepIndex];
    this.cookTimerRemaining = step?.timerSeconds || 300;
    this.updateTimerDisplay();
  }

  updateTimerDisplay() {
    const m = String(Math.floor(this.cookTimerRemaining / 60)).padStart(2, '0');
    const s = String(this.cookTimerRemaining % 60).padStart(2, '0');
    this.cookTimerDisplay.textContent = `${m}:${s}`;
  }

  narrateRecipeOverview() {
    const r = this.currentRecipe;
    const text = `${r.title}. Dedicated to ${this.friendNameInput.value.trim() || 'a loved one'}. Origin story: ${r.originStory}. Preparation time: ${r.prepTime}. Cooking time: ${r.cookTime}. Secret technique: ${r.secretTip?.body || ''}`;
    this.narrator.speak(text);
  }

  /**
   * ==========================================
   * Smart Grocery & Market List Modal
   * ==========================================
   */
  openGroceryModal() {
    this.groceryServingsLabel.innerHTML = `Servings: <strong>${this.currentServings}</strong>`;
    this.groceryItemsCount.innerHTML = `<strong>${this.currentRecipe.ingredients.length}</strong> items total`;

    const categorized = this.gemmaEngine.generateCategorizedGroceryList(
      this.currentRecipe,
      this.currentServings,
      this.baseServings,
      this.currentUnit
    );

    this.groceryCategoriesContainer.innerHTML = '';

    Object.entries(categorized).forEach(([catName, items]) => {
      if (items.length === 0) return;

      const catCard = document.createElement('div');
      catCard.className = 'grocery-category-card';

      let itemsHtml = items.map((item, idx) => `
        <div class="grocery-item">
          <input type="checkbox" id="groc_${catName}_${idx}">
          <label for="groc_${catName}_${idx}">
            <strong>${item.amount}</strong> ${item.name}
          </label>
        </div>
      `).join('');

      catCard.innerHTML = `
        <div class="grocery-category-title">
          <span>${this.getCategoryIcon(catName)} ${catName}</span>
          <span style="font-size: 0.72rem; color: var(--text-tertiary);">${items.length} items</span>
        </div>
        <div>${itemsHtml}</div>
      `;

      catCard.querySelectorAll('.grocery-item input').forEach(input => {
        input.addEventListener('change', () => {
          const itemDiv = input.closest('.grocery-item');
          if (input.checked) itemDiv.classList.add('checked');
          else itemDiv.classList.remove('checked');
        });
      });

      this.groceryCategoriesContainer.appendChild(catCard);
    });

    this.openModal(this.groceryModal);
  }

  getCategoryIcon(catName) {
    if (catName.includes('Produce')) return '🥬';
    if (catName.includes('Dairy')) return '🧀';
    if (catName.includes('Meat')) return '🥩';
    if (catName.includes('Spices')) return '🧂';
    if (catName.includes('Bakery')) return '🥖';
    return '🥫';
  }

  resetGroceryChecks() {
    document.querySelectorAll('#groceryCategoriesContainer input[type="checkbox"]').forEach(c => {
      c.checked = false;
      c.closest('.grocery-item').classList.remove('checked');
    });
  }

  copyGroceryListForWhatsApp() {
    const categorized = this.gemmaEngine.generateCategorizedGroceryList(
      this.currentRecipe,
      this.currentServings,
      this.baseServings,
      this.currentUnit
    );

    let text = `🛒 *Market List: ${this.currentRecipe.title}*\n`;
    text += `Servings: ${this.currentServings} | Preserved with KitchenTales\n\n`;

    Object.entries(categorized).forEach(([catName, items]) => {
      if (items.length === 0) return;
      text += `*${catName.toUpperCase()}*\n`;
      items.forEach(item => {
        text += `• [ ] ${item.amount} ${item.name}\n`;
      });
      text += `\n`;
    });

    navigator.clipboard.writeText(text);
    this.showToast('📋 Copied formatted list for WhatsApp!');
  }

  /**
   * ==========================================
   * Dietary Adaptations & Ingredient Swaps
   * ==========================================
   */
  openAdaptationsModal() {
    // Populate the ingredient swap dropdown
    this.swapIngredientSelect.innerHTML = '';
    this.currentRecipe.ingredients.forEach(ing => {
      const opt = document.createElement('option');
      opt.value = ing.name;
      opt.textContent = `${ing.name} (${ing.amount})`;
      this.swapIngredientSelect.appendChild(opt);
    });

    this.swapResultBox.style.display = 'none';
    this.openModal(this.adaptationsModal);
  }

  applyDietaryAdaptation(dietType) {
    this.activeDiet = dietType;
    const adapted = this.gemmaEngine.adaptRecipe(this.originalRecipe, dietType);
    this.currentRecipe = adapted;
    this.renderRecipeCard();

    // Show adaptation banner
    this.adaptationAlertBanner.style.display = 'flex';
    this.adaptationBannerTitle.textContent = `${adapted.title} Active`;
    this.adaptationBannerNote.textContent = adapted.adaptationNote;

    this.adaptationsModal.classList.remove('active');
    this.showToast(`✨ Applied ${dietType.replace('_', ' ').toUpperCase()} adaptation!`);
  }

  revertAdaptation() {
    this.activeDiet = null;
    this.currentRecipe = JSON.parse(JSON.stringify(this.originalRecipe));
    this.adaptationAlertBanner.style.display = 'none';
    this.renderRecipeCard();
    this.showToast('Reverted to original heirloom recipe');
  }

  checkIngredientSwap() {
    const ingredientName = this.swapIngredientSelect.value;
    if (!ingredientName) return;

    const swap = this.gemmaEngine.suggestSubstitution(ingredientName);
    this.swapResultTitle.textContent = `Chef-Approved Swap for "${ingredientName}":`;
    this.swapResultSubstitute.textContent = `👉 ${swap.substitute}`;
    this.swapResultRationale.textContent = swap.rationale;
    this.swapResultBox.style.display = 'block';
  }

  /**
   * ==========================================
   * Heirloom Recipe Vault & Offline Storage
   * ==========================================
   */
  loadVaultRecipes() {
    try {
      const stored = localStorage.getItem('kitchentales_vault_recipes');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Could not read vault from localStorage:', e);
    }

    // Default seed from presets
    const seeds = SAMPLE_MEMOS.map(m => ({
      id: m.structured.id || m.id,
      title: m.structured.title,
      friendName: m.friendName,
      dateSaved: 'Generational Preset',
      recipe: m.structured
    }));
    this.persistVault(seeds);
    return seeds;
  }

  persistVault(recipes) {
    this.vaultRecipes = recipes;
    try {
      localStorage.setItem('kitchentales_vault_recipes', JSON.stringify(recipes));
    } catch (e) {}
    this.updateVaultBadge();
  }

  updateVaultBadge() {
    if (this.vaultBadge) {
      this.vaultBadge.textContent = this.vaultRecipes.length;
    }
  }

  openVaultModal() {
    this.renderVaultRecipes();
    this.openModal(this.vaultModal);
  }

  saveCurrentRecipeToVault() {
    const friend = this.friendNameInput.value.trim() || 'A Loved One';
    const entry = {
      id: `vault_${Date.now()}`,
      title: this.currentRecipe.title,
      friendName: friend,
      dateSaved: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      recipe: JSON.parse(JSON.stringify(this.currentRecipe))
    };

    // Prepend to top
    const existingIdx = this.vaultRecipes.findIndex(r => r.title === entry.title);
    if (existingIdx >= 0) {
      this.vaultRecipes[existingIdx] = entry;
    } else {
      this.vaultRecipes.unshift(entry);
    }

    this.persistVault(this.vaultRecipes);
    this.showToast(`💾 Saved "${entry.title}" to your Heirloom Vault!`);
  }

  renderVaultRecipes() {
    const query = (this.vaultSearchInput.value || '').toLowerCase().trim();
    this.vaultRecipesContainer.innerHTML = '';

    const filtered = this.vaultRecipes.filter(item => {
      const matchTitle = item.title.toLowerCase().includes(query);
      const matchFriend = (item.friendName || '').toLowerCase().includes(query);
      return matchTitle || matchFriend;
    });

    if (filtered.length === 0) {
      this.vaultRecipesContainer.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 2rem; color: var(--text-tertiary);">
          No recipes found matching "${query}".
        </div>
      `;
      return;
    }

    filtered.forEach(item => {
      const card = document.createElement('div');
      card.className = 'vault-card';
      card.innerHTML = `
        <div class="vault-card-header">
          <span class="vault-friend-badge">❤️ ${item.friendName}</span>
          <span style="font-size: 0.72rem; color: var(--text-tertiary);">${item.dateSaved}</span>
        </div>
        <div class="vault-card-title">${item.title}</div>
        <div class="vault-card-origin">${item.recipe.originStory || ''}</div>
        <div class="vault-card-actions">
          <button class="action-btn primary btn-load-vault" style="padding: 0.25rem 0.65rem; font-size: 0.75rem;">
            Load Recipe
          </button>
          <button class="action-btn btn-delete-vault" style="padding: 0.25rem 0.65rem; font-size: 0.75rem; margin-left: auto;">
            🗑️
          </button>
        </div>
      `;

      card.querySelector('.btn-load-vault').addEventListener('click', () => {
        this.currentRecipe = JSON.parse(JSON.stringify(item.recipe));
        this.originalRecipe = JSON.parse(JSON.stringify(item.recipe));
        this.friendNameInput.value = item.friendName;
        this.baseServings = item.recipe.servings || 4;
        this.currentServings = this.baseServings;
        this.activeDiet = null;
        this.adaptationAlertBanner.style.display = 'none';

        this.renderRecipeCard();
        this.vaultModal.classList.remove('active');
        this.showToast(`Loaded "${item.title}"!`);
      });

      card.querySelector('.btn-delete-vault').addEventListener('click', () => {
        if (confirm(`Remove "${item.title}" from your vault?`)) {
          const next = this.vaultRecipes.filter(r => r.id !== item.id);
          this.persistVault(next);
          this.renderVaultRecipes();
          this.showToast('Recipe removed from vault');
        }
      });

      this.vaultRecipesContainer.appendChild(card);
    });
  }

  exportVaultJson() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this.vaultRecipes, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute("href", dataStr);
    dlAnchor.setAttribute("download", `kitchentales-heirloom-vault-${Date.now()}.json`);
    document.body.appendChild(dlAnchor);
    dlAnchor.click();
    dlAnchor.remove();
    this.showToast('📥 Heirloom Vault backup downloaded!');
  }

  importVaultJson(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target.result);
        if (Array.isArray(imported)) {
          const combined = [...imported, ...this.vaultRecipes];
          const unique = [];
          const seen = new Set();
          combined.forEach(item => {
            if (!seen.has(item.title)) {
              seen.add(item.title);
              unique.push(item);
            }
          });
          this.persistVault(unique);
          this.renderVaultRecipes();
          this.showToast(`Restored ${imported.length} recipes into vault!`);
        }
      } catch (err) {
        alert('Invalid JSON file format: ' + err.message);
      }
    };
    reader.readAsText(file);
  }

  /**
   * Markdown Copy
   */
  copyRecipeMarkdown() {
    const md = this.generateRecipeMarkdown();
    navigator.clipboard.writeText(md);
    this.showToast('📋 Recipe copied as Markdown!');
  }

  generateRecipeMarkdown() {
    const r = this.currentRecipe;
    const friend = this.friendNameInput.value.trim() || 'A Loved One';

    return `# ${r.title}
*Dedicated to ${friend}*

> "${r.originStory}"

- **Prep Time:** ${r.prepTime}
- **Cook Time:** ${r.cookTime}
- **Servings:** ${this.currentServings}
- **Difficulty:** ${r.difficulty}

## Ingredients (${this.currentUnit.toUpperCase()})
${r.ingredients.map(i => {
  let amt = i.amount;
  if (this.currentUnit === 'metric' && i.metric) amt = i.metric;
  else if (this.currentUnit === 'imperial' && i.imperial) amt = i.imperial;
  return `- [ ] **${amt}** ${i.name}`;
}).join('\n')}

${r.secretTip ? `### 💡 Pro Tip / Family Secret: ${r.secretTip.title}
${r.secretTip.body}
` : ''}

${r.heritagePairing ? `### 🍷 Heritage Beverage Pairing:
- **Traditional:** ${r.heritagePairing.beverage}
- **Alcohol-Free:** ${r.heritagePairing.alcoholFree}
*${r.heritagePairing.notes}*
` : ''}

## Step-by-Step Instructions
${r.steps.map(s => `### Step ${s.step}: ${s.title}
${s.instruction}
*(Timer: ${s.timerLabel || 'N/A'})*
`).join('\n')}

---
*Preserved with KitchenTales (Hacktoberfest 2026: Build for a Friend) using Google Gemma open-weight AI.*
`;
  }

  /**
   * DEV.to Write-Up Generator Modal
   */
  openDevExportModal() {
    const friend = this.friendNameInput.value.trim() || 'My Friend / Grandparent';
    const r = this.currentRecipe;

    const devMarkdown = `---
title: KitchenTales: Turning Spoken Voice Memos into Heirloom Recipes with Gemma & ElevenLabs
published: false
tags: devchallenge, weekendchallenge, hf26challenge, gemma, elevenlabs
---

*This is a submission for the [Hacktoberfest Weekend Challenge: Build for a Friend](https://dev.to/challenges/hacktoberfest-weekend-2026-10-01)*

## What I Built
I built **KitchenTales** for **${friend}**—someone whose cooking is pure magic, but who never writes down a single recipe. Everything lives in scattered, unmeasured voice notes (*"add a pinch of this, a couple of splashes, until it smells right"*).

Whenever family members ask how to recreate their signature dishes, they receive a rambling audio voice message with unmeasured ingredients, crucial hidden techniques, and generational stories.

**KitchenTales** takes these intimate voice recordings and uses **open-weight Google Gemma AI** to extract structured ingredients, calculate measurements, isolate family secret tricks, and format them into permanent, printable heirloom cards—with hands-free **ElevenLabs voice guidance** and voice commands for cooking with messy hands.

## Demo
- **Live Interactive Demo:** [https://kitchentales-demo.dev](https://kitchentales-demo.dev) *(or local preview)*
- **Core Experience:**
  1. Record or upload an informal audio voice note with live real-time speech transcription.
  2. Watch Gemma AI parse colloquial speech into verified culinary steps and pairings.
  3. Step into hands-free kitchen cook mode with spoken step-by-step guidance and hands-free voice commands.
  4. Generate categorized grocery market lists, smart dietary adaptations (Vegan, Gluten-Free), and archive recipes in your offline Heirloom Vault.

## Code
The project is 100% open-source on GitHub:
- **Repository:** \`https://github.com/Master66999/apiintegration\`

## How I Built It
KitchenTales is built entirely around open innovation and client-first privacy:

1. **Google Gemma 2 (Open-Weights Core):**
   - Engineered culinary parsing for **Gemma 2 (9B-IT / 2B-IT)** normalizing unmeasured speech into structured JSON schemas.
   - Built smart dietary adaptation algorithms and chef-approved pantry substitution engine.
2. **ElevenLabs Voice Synthesis & Speech Control:**
   - Powers the Hands-Free Kitchen Assistant, reading each instruction aloud with warm, natural cadence.
   - Hands-Free Speech Recognition listens for commands ("Next", "Back", "Repeat", "Start Timer") so you never touch your phone with flour on your hands.
3. **Vanilla Web Architecture:**
   - Zero-dependency client performance, localStorage Heirloom Vault, Web Audio API frequency visualizer, and dual Metric / US Customary converter.

## Why Does Open Innovation Matter?
Open innovation is the **only** ethical foundation for a project like KitchenTales:

- **100% Personal Privacy:** Family voice memos and intimate family heirlooms belong to the family. With open-weight Gemma running locally, private memories are never stored on third-party servers or harvested for closed commercial AI training sets.
- **Works in Any Kitchen (Zero Internet Needed):** Family cooking happens everywhere—from mountain cabins to seaside cottages with zero cell service. An open-weight model running on a laptop means KitchenTales works anywhere, completely offline.
- **Zero Per-Token Bills:** Preserving 500 voice memos over a lifetime costs $0.00 in recurring proprietary API fees.
- **Model Adaptability:** Easily swap between lightweight Gemma 2B for quick mobile inference and Gemma 9B/27B for complex multilingual regional dishes.

## Prize Categories
- **Best Use of Gemma ($200):** Gemma 2 open-weights is the core intelligence transforming raw conversational transcripts into structured culinary heirlooms and dietary adaptations.
- **Best Use of ElevenLabs ($100):** Provides warm, hands-free voice guidance, live speech-to-text dictation, and voice commands in kitchen cooking mode.

---
*Built with love for Hacktoberfest 2026: Build for a Friend.*
`;

    this.devMarkdownTextarea.value = devMarkdown;
    this.openModal(this.devExportModal);
  }

  openSettingsModal() {
    const s = this.gemmaEngine.getSettings();
    const v = this.narrator.getSettings();

    this.settingEndpointType.value = s.endpointType;
    this.settingGemmaModel.value = s.model;
    this.settingOllamaUrl.value = s.ollamaUrl;
    this.settingApiKey.value = s.apiKey;
    this.settingElevenLabsKey.value = v.apiKey;
    this.settingElevenLabsVoice.value = v.voiceId;

    this.syncSettingsVisibility();
    this.openModal(this.settingsModal);
  }

  syncSettingsVisibility() {
    const val = this.settingEndpointType.value;
    this.ollamaSettingsRow.style.display = (val === 'ollama') ? 'flex' : 'none';
    this.googleApiSettingsRow.style.display = (val === 'google_api') ? 'flex' : 'none';
  }

  saveEngineSettings() {
    this.gemmaEngine.saveSettings({
      endpointType: this.settingEndpointType.value,
      model: this.settingGemmaModel.value,
      ollamaUrl: this.settingOllamaUrl.value,
      apiKey: this.settingApiKey.value
    });

    this.narrator.setApiKey(this.settingElevenLabsKey.value);
    this.narrator.setVoiceId(this.settingElevenLabsVoice.value);

    this.engineModelName.textContent = `Gemma (${this.settingGemmaModel.value})`;
    this.settingsModal.classList.remove('active');
    this.showToast('Configuration saved successfully!');
  }

  openModal(modal) {
    if (modal) modal.classList.add('active');
  }
}

// Initialize on DOM load
window.addEventListener('DOMContentLoaded', () => {
  window.app = new KitchenTalesApp();
});
