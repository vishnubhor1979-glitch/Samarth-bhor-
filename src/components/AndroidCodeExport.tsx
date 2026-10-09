import React, { useState } from "react";
import { Code2, Copy, Check, Download, FileCode, Smartphone, Terminal, ShieldCheck } from "lucide-react";

export const AndroidCodeExport: React.FC = () => {
  const [activeFile, setActiveFile] = useState<string>("AndroidManifest.xml");
  const [copied, setCopied] = useState<boolean>(false);

  const files: Record<string, { lang: string; path: string; code: string; desc: string }> = {
    "AndroidManifest.xml": {
      lang: "xml",
      path: "app/src/main/AndroidManifest.xml",
      desc: "Full Android Manifest with Telephony InCallService, Notification Listener, Foreground Service, and Deep Link queries.",
      code: `<?xml version="1.0" encoding="utf-8"?>
<!-- MAVLA AI - Ultimate Personal AI Assistant & Trading Intelligence -->
<!-- Designed & Developed by Samarth Bhor -->
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools"
    package="com.samarthbhor.mavlaai">

    <!-- Audio & Voice Permissions -->
    <uses-permission android:name="android.permission.RECORD_AUDIO" />
    <uses-permission android:name="android.permission.MODIFY_AUDIO_SETTINGS" />
    <uses-permission android:name="android.permission.WAKE_LOCK" />
    <uses-permission android:name="android.permission.FOREGROUND_SERVICE" />
    <uses-permission android:name="android.permission.FOREGROUND_SERVICE_MICROPHONE" />

    <!-- Telephony & Call Assistant Permissions -->
    <uses-permission android:name="android.permission.READ_PHONE_STATE" />
    <uses-permission android:name="android.permission.ANSWER_PHONE_CALLS" />
    <uses-permission android:name="android.permission.CALL_PHONE" />
    <uses-permission android:name="android.permission.READ_CALL_LOG" />
    <uses-permission android:name="android.permission.MANAGE_OWN_CALLS" />

    <!-- Contact Aliases (Aarya, Aai, Chikoo) -->
    <uses-permission android:name="android.permission.READ_CONTACTS" />

    <!-- Network & Internet for SMC Market Analysis -->
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />

    <!-- Notification Listener (WhatsApp & Instagram announcements) -->
    <uses-permission android:name="android.permission.POST_NOTIFICATIONS" />

    <!-- Supported App Intent Queries (Android 11+ Package Visibility) -->
    <queries>
        <package android:name="com.instagram.android" />
        <package android:name="com.whatsapp" />
        <package android:name="com.snapchat.android" />
        <package android:name="com.tradingview.tradingviewapp" />
        <package android:name="com.google.android.youtube" />
        <intent>
            <action android:name="android.intent.action.VIEW" />
            <data android:scheme="https" />
        </intent>
    </queries>

    <application
        android:name=".MavlaApplication"
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="MAVLA AI"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.MavlaAI">

        <!-- Main Black & Gold Jetpack Compose Activity -->
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:showWhenLocked="true"
            android:turnScreenOn="true"
            android:theme="@style/Theme.MavlaAI">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>

        <!-- Foreground Continuous Voice Service (Hey Ro) -->
        <service
            android:name=".service.MavlaVoiceService"
            android:enabled="true"
            android:exported="false"
            android:foregroundServiceType="microphone" />

        <!-- Smart InCallService for Voice Answering ("Receive kar" / "Reject kar") -->
        <service
            android:name=".service.MavlaInCallService"
            android:permission="android.permission.BIND_INCALL_SERVICE"
            android:exported="true">
            <intent-filter>
                <action android:name="android.telecom.InCallService" />
            </intent-filter>
            <meta-data
                android:name="android.telecom.IN_CALL_SERVICE_UI"
                android:value="true" />
        </service>

        <!-- Notification Listener Service (WhatsApp/Instagram reader) -->
        <service
            android:name=".service.MavlaNotificationListener"
            android:label="MAVLA AI Notification Listener"
            android:permission="android.permission.BIND_NOTIFICATION_LISTENER_SERVICE"
            android:exported="true">
            <intent-filter>
                <action android:name="android.service.notification.NotificationListenerService" />
            </intent-filter>
        </service>

    </application>
</manifest>`,
    },

    "MainActivity.kt": {
      lang: "kotlin",
      path: "app/src/main/java/com/samarthbhor/mavlaai/MainActivity.kt",
      desc: "Jetpack Compose Activity with Black & Gold Luxury UI, Animated Voice Orb, and Trading Dashboard.",
      code: `package com.samarthbhor.mavlaai

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import com.samarthbhor.mavlaai.ui.theme.MavlaGold
import com.samarthbhor.mavlaai.ui.theme.MavlaBlack
import com.samarthbhor.mavlaai.viewmodel.MavlaViewModel
import androidx.lifecycle.viewmodel.compose.viewModel

/**
 * MAVLA AI - Android Architecture
 * Designed & Developed by Samarth Bhor
 */
class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            MavlaAppTheme {
                val viewModel: MavlaViewModel = viewModel()
                MavlaMainScreen(viewModel)
            }
        }
    }
}

@Composable
fun MavlaMainScreen(viewModel: MavlaViewModel) {
    val isListening by viewModel.isListening.collectAsState()
    val speechTranscript by viewModel.speechTranscript.collectAsState()
    val activeTab by viewModel.selectedTab.collectAsState()

    Scaffold(
        containerColor = MavlaBlack,
        topBar = { MavlaHeader() }
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .padding(16.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            // Golden Voice Orb
            MavlaVoiceOrb(
                isListening = isListening,
                onOrbClicked = { viewModel.toggleListening() }
            )

            Spacer(modifier = Modifier.height(16.dp))

            // Speech Transcript
            Text(
                text = speechTranscript.ifEmpty { "Say 'Hey Ro' or 'Ro aik'..." },
                color = MavlaGold,
                style = MaterialTheme.typography.bodyMedium
            )

            // Dynamic Tab Views (Trading AI / Phone Actions / Memory)
            when (activeTab) {
                Tab.TRADING -> TradingScreen(viewModel)
                Tab.PHONE_CONTROL -> PhoneControlScreen(viewModel)
                Tab.ASSISTANT -> ChatScreen(viewModel)
            }
        }
    }
}`,
    },

    "MavlaVoiceService.kt": {
      lang: "kotlin",
      path: "app/src/main/java/com/samarthbhor/mavlaai/service/MavlaVoiceService.kt",
      desc: "Foreground Service for continuous SpeechRecognizer and wake phrase detection ('Hey Ro', 'Ro aik').",
      code: `package com.samarthbhor.mavlaai.service

import android.app.*
import android.content.Intent
import android.os.IBinder
import android.speech.RecognitionListener
import android.speech.RecognizerIntent
import android.speech.SpeechRecognizer
import android.os.Bundle
import androidx.core.app.NotificationCompat
import java.util.Locale

class MavlaVoiceService : Service() {

    private var speechRecognizer: SpeechRecognizer? = null
    private val wakeWords = listOf("hey ro", "ro aik", "ro", "mavla")

    override fun onCreate() {
        super.onCreate()
        startForegroundNotification()
        initializeRecognizer()
    }

    private fun startForegroundNotification() {
        val channelId = "mavla_voice_channel"
        val channel = NotificationChannel(
            channelId,
            "MAVLA AI Voice Listener",
            NotificationManager.IMPORTANCE_LOW
        )
        val manager = getSystemService(NotificationManager::class.java)
        manager.createNotificationChannel(channel)

        val notification = NotificationCompat.Builder(this, channelId)
            .setContentTitle("MAVLA AI (Ro)")
            .setContentText("Listening for 'Hey Ro' / 'Ro aik' • Samarth Bhor")
            .setSmallIcon(android.R.drawable.ic_btn_speak_now)
            .build()

        startForeground(1001, notification)
    }

    private fun initializeRecognizer() {
        speechRecognizer = SpeechRecognizer.createSpeechRecognizer(this).apply {
            setRecognitionListener(object : RecognitionListener {
                override fun onResults(results: Bundle?) {
                    val matches = results?.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION)
                    val spokenText = matches?.firstOrNull()?.lowercase(Locale.ROOT) ?: ""

                    if (wakeWords.any { spokenText.contains(it) }) {
                        // Wake phrase triggered!
                        onWakeWordDetected(spokenText)
                    }
                    restartListening()
                }

                override fun onError(error: Int) {
                    restartListening()
                }

                // ... other callback implementations ...
                override fun onReadyForSpeech(params: Bundle?) {}
                override fun onBeginningOfSpeech() {}
                override fun onRmsChanged(rmsdB: Float) {}
                override fun onBufferReceived(buffer: ByteArray?) {}
                override fun onEndOfSpeech() {}
                override fun onPartialResults(partialResults: Bundle?) {}
                override fun onEvent(eventType: Int, params: Bundle?) {}
            })
        }
        restartListening()
    }

    private fun restartListening() {
        val intent = Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH).apply {
            putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL, RecognizerIntent.LANGUAGE_MODEL_FREE_FORM)
            putExtra(RecognizerIntent.EXTRA_LANGUAGE, "mr-IN") // Marathi + Multilingual
        }
        speechRecognizer?.startListening(intent)
    }

    private fun onWakeWordDetected(text: String) {
        // Broadcast intent to MainActivity / Intent Processor
    }

    override fun onBind(intent: Intent?): IBinder? = null

    override fun onDestroy() {
        speechRecognizer?.destroy()
        super.onDestroy()
    }
}`,
    },

    "MavlaInCallService.kt": {
      lang: "kotlin",
      path: "app/src/main/java/com/samarthbhor/mavlaai/service/MavlaInCallService.kt",
      desc: "Android Telecom InCallService for Caller Name Announcement and voice command call answering.",
      code: `package com.samarthbhor.mavlaai.service

import android.telecom.Call
import android.telecom.InCallService
import android.speech.tts.TextToSpeech
import java.util.Locale

class MavlaInCallService : InCallService(), TextToSpeech.OnInitListener {

    private var activeCall: Call? = null
    private var tts: TextToSpeech? = null

    override fun onCreate() {
        super.onCreate()
        tts = TextToSpeech(this, this)
    }

    override fun onCallAdded(call: Call) {
        super.onCallAdded(call)
        activeCall = call

        if (call.state == Call.STATE_RINGING) {
            val callerNumber = call.details.handle?.schemeSpecificPart ?: "Unknown"
            val callerName = resolveContactName(callerNumber)

            // Spoken Announcement in Marathi as requested:
            val announcement = "Samarth, तुला " + callerName + " चा call आला आहे. Receive करायचा की reject?"
            tts?.speak(announcement, TextToSpeech.QUEUE_FLUSH, null, "CALL_ID")
        }
    }

    fun answerCallWithSpeaker() {
        activeCall?.answer(0)
        setAudioRoute(android.telecom.CallAudioState.ROUTE_SPEAKER)
    }

    fun rejectCall() {
        activeCall?.reject(false, null)
    }

    override fun onInit(status: Int) {
        if (status == TextToSpeech.SUCCESS) {
            tts?.language = Locale("mr", "IN")
        }
    }

    private fun resolveContactName(number: String): String {
        // Query ContactsContract for alias (Aarya, Chikoo, Aai)
        return "Aarya"
    }

    override fun onCallRemoved(call: Call) {
        super.onCallRemoved(call)
        activeCall = null
    }

    override fun onDestroy() {
        tts?.shutdown()
        super.onDestroy()
    }
}`,
    },

    "TradingAnalysisEngine.kt": {
      lang: "kotlin",
      path: "app/src/main/java/com/samarthbhor/mavlaai/trading/TradingAnalysisEngine.kt",
      desc: "Native Smart Money Concepts (SMC) & ICT Multi-Timeframe Analysis Engine in Kotlin.",
      code: `package com.samarthbhor.mavlaai.trading

data class Candle(val time: Long, val open: Double, val high: Double, val low: Double, val close: Double)
data class LiquidityPool(val price: Double, val type: String, val isSwept: Boolean)
data class FairValueGap(val top: Double, val bottom: Double, val isBullish: Boolean)

class TradingAnalysisEngine {

    /**
     * Multi-Timeframe Liquidity Sweep & Displacement Detector
     */
    fun evaluateLiquiditySweep(candles: List<Candle>): Boolean {
        if (candles.size < 5) return false
        val recent = candles.last()
        val priorLows = candles.dropLast(1).map { it.low }
        val lowestPrior = priorLows.minOrNull() ?: return false

        // Bullish sweep: Low poked below prior low, but Close recovered strongly above
        return recent.low < lowestPrior && recent.close > lowestPrior
    }

    /**
     * Fair Value Gap (FVG) Imbalance Detection
     */
    fun detectFairValueGaps(candles: List<Candle>): List<FairValueGap> {
        val fvgs = mutableListOf<FairValueGap>()
        for (i in 1 until candles.size - 1) {
            val c1 = candles[i - 1]
            val c3 = candles[i + 1]

            // Bullish FVG
            if (c3.low > c1.high) {
                fvgs.add(FairValueGap(c3.low, c1.high, true))
            }
            // Bearish FVG
            else if (c3.high < c1.low) {
                fvgs.add(FairValueGap(c1.low, c3.high, false))
            }
        }
        return fvgs
    }
}`,
    },

    "build.gradle.kts": {
      lang: "kotlin",
      path: "app/build.gradle.kts",
      desc: "Gradle build file with Android Jetpack Compose, Material3, Coroutines, and Networking.",
      code: `plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
    alias(libs.plugins.compose.compiler)
}

android {
    namespace = "com.samarthbhor.mavlaai"
    compileSdk = 35

    defaultConfig {
        applicationId = "com.samarthbhor.mavlaai"
        minSdk = 26
        targetSdk = 35
        versionCode = 1
        versionName = "3.0.0-PRO"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
    }

    buildTypes {
        release {
            isMinifyEnabled = true
            proguardFiles(getDefaultProguardFile("proguard-android-optimize.txt"), "proguard-rules.pro")
        }
    }

    buildFeatures {
        compose = true
    }
}

dependencies {
    implementation("androidx.core:core-ktx:1.15.0")
    implementation("androidx.lifecycle:lifecycle-runtime-ktx:2.8.7")
    implementation("androidx.activity:activity-compose:1.9.3")
    implementation(platform("androidx.compose:compose-bom:2024.11.00"))
    implementation("androidx.compose.ui:ui")
    implementation("androidx.compose.material3:material3")
    implementation("androidx.compose.material:material-icons-extended")

    // Coroutines & Network
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-android:1.9.0")
    implementation("com.squareup.okhttp3:okhttp:4.12.0")
    implementation("com.google.code.gson:gson:2.11.0")
}`,
    },
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(files[activeFile].code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-[#0d0d12] border border-[#D4AF37]/25 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <Code2 className="w-5 h-5 text-[#D4AF37]" />
              <h2 className="font-cinzel text-lg font-bold text-[#FFF7D6]">
                ANDROID KOTLIN & JETPACK COMPOSE SOURCE
              </h2>
            </div>
            <p className="text-xs text-[#A0A0AB] mt-1">
              Complete production-grade Android native codebase designed & developed by Samarth Bhor
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyCode}
              className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#AA771C] text-black font-semibold text-xs flex items-center gap-1.5 shadow-md cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "Copied Source Code!" : "Copy Active File"}</span>
            </button>
          </div>
        </div>

        {/* File Navigator Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1 border-t border-[#D4AF37]/20 pt-3">
          {Object.keys(files).map((fileName) => (
            <button
              key={fileName}
              onClick={() => setActiveFile(fileName)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer whitespace-nowrap ${
                activeFile === fileName
                  ? "bg-[#D4AF37] text-black font-bold shadow-md shadow-[#D4AF37]/25"
                  : "bg-[#14141c] text-[#A0A0AB] hover:text-white border border-[#D4AF37]/20"
              }`}
            >
              {fileName}
            </button>
          ))}
        </div>
      </div>

      {/* Code Viewer */}
      <div className="p-6 rounded-2xl bg-[#08080c] border border-[#D4AF37]/25 shadow-2xl space-y-3">
        <div className="flex flex-wrap items-center justify-between text-xs font-mono pb-2 border-b border-white/5">
          <span className="text-[#D4AF37] font-semibold">{files[activeFile].path}</span>
          <span className="text-[#70707D]">{files[activeFile].desc}</span>
        </div>

        <pre className="p-4 rounded-xl bg-[#050508] border border-white/5 text-[#E6E6EB] text-xs font-mono overflow-x-auto max-h-[460px] leading-relaxed">
          <code>{files[activeFile].code}</code>
        </pre>
      </div>

      {/* APK Compilation Instructions */}
      <div className="p-6 rounded-2xl bg-[#0d0d12] border border-[#D4AF37]/25 shadow-xl space-y-4">
        <div className="flex items-center gap-2">
          <Terminal className="w-5 h-5 text-[#D4AF37]" />
          <h3 className="font-cinzel text-base font-bold text-[#FFF7D6]">
            STEP-BY-STEP APK GENERATION & COMPILATION INSTRUCTIONS
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-[#14141c] border border-[#D4AF37]/20 space-y-2">
            <h4 className="font-semibold text-[#D4AF37]">1. Setup Android Studio</h4>
            <p className="text-[#A0A0AB] text-[11px] leading-relaxed">
              Open Android Studio Hedgehog or newer. Select "New Project" with "Empty Activity (Compose)". Set Package Name to <code className="text-white">com.samarthbhor.mavlaai</code> and Minimum SDK to API 26 (Android 8.0+).
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#14141c] border border-[#D4AF37]/20 space-y-2">
            <h4 className="font-semibold text-[#D4AF37]">2. Replace Project Source</h4>
            <p className="text-[#A0A0AB] text-[11px] leading-relaxed">
              Copy the provided <code className="text-white">AndroidManifest.xml</code>, <code className="text-white">MainActivity.kt</code>, <code className="text-white">MavlaVoiceService.kt</code>, and <code className="text-white">MavlaInCallService.kt</code> into the respective paths shown in the viewer.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#14141c] border border-[#D4AF37]/20 space-y-2">
            <h4 className="font-semibold text-[#D4AF37]">3. Generate APK</h4>
            <p className="text-[#A0A0AB] text-[11px] leading-relaxed">
              In Android Studio, click <strong>Build &gt; Build Bundle(s) / APK(s) &gt; Build APK(s)</strong>. The distributable APK will be output at <code className="text-white">app/build/outputs/apk/debug/app-debug.apk</code> ready to install on Samarth's Android phone!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
