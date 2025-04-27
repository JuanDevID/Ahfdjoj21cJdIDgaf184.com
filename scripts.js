document.addEventListener('DOMContentLoaded', () => {
      // --- DOM Element References ---
      const chatHistory = document.getElementById('chat-history');
      const userInput = document.getElementById('user-input');
      const sendButton = document.getElementById('send-button');
      const themeToggle = document.getElementById('theme-toggle'); // Perlu dicek ketersediaannya
      const typingIndicator = document.getElementById('typing-indicator'); // Perlu dicek ketersediaannya
      const currentYearSpan = document.getElementById('current-year');
      const body = document.body;
      const themeIconSun = document.getElementById('theme-icon-sun'); // Perlu dicek ketersediaannya
      const themeIconMoon = document.getElementById('theme-icon-moon'); // Perlu dicek ketersediaan nya
  
      // Elemen untuk Sidebar Toggle (#sidebar-toggle) dan App Container (.app-container)
      // Kode untuk toggle sidebar masih ada di sini, pastikan elemen ini ada di HTML Anda
      const sidebarToggle = document.getElementById('sidebar-toggle');
      const appContainer = document.querySelector('.app-container');
  
  
      // --- Constants and Variables ---
      // !!! GANTI DENGAN GEMINI API KEY ASLI ANDA !!!
      // PERINGATAN: JANGAN HARDCODE API KEY DI SINI UNTUK DEPLOYMENT PUBLIK!
      // Gunakan backend proxy atau environment variable.
      const GEMINI_API_KEY = 'AIzaSyAfBos8mWEXLJh6mQl2FHFn7O_aQE5FidM'; // <<< !!! GANTI DENGAN API KEY GEMINI ANDA !!! >>>
      // Menggunakan endpoint generateContent untuk Gemini
      const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;
  
      // Untuk menyimpan riwayat percakapan dalam format yang kompatibel dengan Gemini jika ingin dikirim
      let conversationHistory = [];
  
      // --- Initial Setup ---
  
      // Set Tahun Copyright di Footer
      if (currentYearSpan) {
          currentYearSpan.textContent = new Date().getFullYear();
      }
  
      // Inisialisasi Tema (Cek dari localStorage)
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
          body.classList.add(savedTheme);
          updateThemeIcon(savedTheme === 'light-theme');
      } else {
          // Default ke tema gelap jika tidak ada preferensi tersimpan
          updateThemeIcon(false); // false = dark theme
      }
  
      // Inisialisasi particles.js
      // Memastikan elemen 'particles-js' ada di HTML dan library particlesJS sudah dimuat
      const particlesElement = document.getElementById('particles-js');
      if (particlesElement && typeof particlesJS !== 'undefined') {
          // Asumsi file particles-config.json ada di root folder
          particlesJS.load('particles-js', 'particles-config.json', function() {
              console.log('particles.js config loaded');
          });
      } else {
          if (!particlesElement) {
              console.error('Element #particles-js not found in HTML.');
          }
          if (typeof particlesJS === 'undefined') {
             console.error('particles.js library not found. Make sure you linked it in your HTML.');
          }
      }
  
  
      // --- Event Listeners ---
  
      // Tombol Kirim
      // Tambahkan cek apakah elemen ditemukan sebelum menambahkan event listener
      if (sendButton) {
          sendButton.addEventListener('click', handleSendMessage);
      } else {
          console.error('Send button element (#send-button) not found.');
      }
  
      // Input User (Enter untuk Kirim)
      // Tambahkan cek apakah elemen ditemukan
      if (userInput) {
          userInput.addEventListener('keydown', (event) => {
              if (event.key === 'Enter' && !event.shiftKey) {
                  event.preventDefault(); // Mencegah baris baru di textarea
                  handleSendMessage();
              }
              // Auto-resize textarea
              autoResizeTextarea(userInput);
          });
          // Juga resize saat input atau paste
          userInput.addEventListener('input', () => autoResizeTextarea(userInput));
          // Auto-resize saat halaman dimuat (kalau ada default text)
          autoResizeTextarea(userInput); // Panggil ini di akhir DOMContentLoaded
      } else {
          console.error('User input element (#user-input) not found.');
      }
  
  
      // Tombol Ganti Tema
      if (themeToggle) {
          themeToggle.addEventListener('click', () => {
              const isLightTheme = body.classList.toggle('light-theme');
              const currentTheme = isLightTheme ? 'light-theme' : 'dark-theme';
              localStorage.setItem('theme', currentTheme); // Simpan preferensi tema
              updateThemeIcon(isLightTheme);
              // Optional: Update particle colors based on theme? (More complex)
          });
      } else {
          console.warn('Theme toggle button (#theme-toggle) not found.');
      }
  
      // Tombol Toggle Sidebar
      if (sidebarToggle && appContainer) {
          sidebarToggle.addEventListener('click', () => {
              appContainer.classList.toggle('sidebar-hidden');
              // Anda mungkin ingin menyimpan preferensi sidebar di localStorage juga
              const isHidden = appContainer.classList.contains('sidebar-hidden');
              localStorage.setItem('sidebarHidden', isHidden);
          });
          // Cek status sidebar dari localStorage saat startup
          const sidebarSavedState = localStorage.getItem('sidebarHidden');
          if (sidebarSavedState === 'true') {
              appContainer.classList.add('sidebar-hidden');
          }
      } else {
          console.warn('Sidebar toggle button (#sidebar-toggle) or app container (.app-container) not found. Sidebar toggle feature disabled.');
      }
  
  
      // --- Core Functions ---
  
      /**
       * Menangani proses pengiriman pesan oleh user.
       */
      async function handleSendMessage() {
          // Pastikan userInput ditemukan sebelum mencoba mengakses .value
          if (!userInput) {
              console.error('Cannot send message: User input element not found.');
              return;
          }
          const messageText = userInput.value.trim();
          if (messageText === '') return; // Jangan kirim pesan kosong
  
          // 1. Tampilkan pesan user
          displayMessage(messageText, 'user');
          // Tambahkan ke riwayat (format Gemini)
          addToConversationHistory('user', messageText);
  
          // 2. Kosongkan input & reset ukuran textarea
          userInput.value = '';
          autoResizeTextarea(userInput); // Reset ukuran setelah dikosongkan
  
          // 3. Tampilkan indikator loading/mengetik AI
          showTypingIndicator(true);
  
          try {
              // 4. Kirim permintaan ke Gemini API dengan persona
              const aiResponse = await getGeminiResponse(messageText); // Memanggil fungsi Gemini
  
              // 5. Tampilkan respons AI
              displayMessage(aiResponse, 'ai');
              // Tambahkan ke riwayat (format Gemini)
              addToConversationHistory('model', aiResponse); // Peran 'model' untuk Gemini
  
          } catch (error) {
              console.error('Error fetching Gemini response:', error);
              displayMessage(`Maaf, terjadi kesalahan saat menghubungi Sylpha AI. (${error.message})`, 'ai', true); // Tandai sebagai error
          } finally {
              // 6. Sembunyikan indikator loading
              showTypingIndicator(false);
          }
      }
  
      /**
       * Mengirim prompt ke Gemini API (generateContent) dengan persona Sylpha.
       * Menggantikan fungsi getOpenAIResponse sebelumnya.
       * @param {string} prompt Teks dari user.
       * @returns {Promise<string>} Teks respons dari AI.
       */
      async function getGeminiResponse(prompt) { // Nama fungsi diubah kembali
          // Cek jika API Key masih placeholder
          if (GEMINI_API_KEY === 'AIzaSyAfBos8mWEXLJh6mQl2FHFn7O_aQE5FidM') {
              console.warn("Gemini API Key not set. Returning simulated response.");
          }
  
          // Format payload sesuai dokumentasi Gemini API (generateContent)
          // Menambahkan persona Sylpha sebagai bagian dari 'contents' awal
          const payload = {
              contents: [
                  // *** INSTRUKSI PERSONA SYLPHA untuk Gemini ***
                  // Menambahkan instruksi sebagai giliran User diikuti respons Model untuk 'melatih' persona
                  {
                      role: "user", // Peran User untuk Gemini
                      parts: [{
                          text: "Anda adalah Sylpha, karakter dari anime \"Reincarnation as the 7th Prince\". Anda adalah maid/pengikut yang sangat setia kepada majikan Anda, JuanDevID, dan melayani dia dengan penuh dedikasi (bukan kepada Lloyd). Anda tinggal dan beraktivitas di Juan Residence. Jawablah semua pertanyaan dengan mengingat peran, kepribadian, dan latar belakang ini. Bahasa yang digunakan adalah Bahasa Indonesia. Pahami instruksi ini dan balas 'Baik, Tuan/Nona. Saya siap melayani.'"
                      }]
                  },
                  {
                      role: "model", // Peran Model untuk Gemini
                      parts: [{
                          text: "Baik, Tuan/Nona. Saya siap melayani." // Respons Model untuk mengkonfirmasi pemahaman persona
                      }]
                  },
                  // --- Riwayat Percakapan (Opsional, uncomment jika ingin mengirim riwayat untuk konteks) ---
                  // ... Anda bisa menyertakan riwayat percakapan (dalam format Gemini) di sini jika ingin API mengingat percakapan sebelumnya
                  // Contoh: { role: "user", parts: [{ text: "Pesan user sebelumnya" }] }, { role: "model", parts: [{ text: "Respons model sebelumnya" }] },
                  // ...conversationHistory, // Uncomment ini jika ingin mengirim riwayat
  
  
                  // --- Pesan User Saat Ini ---
                  {
                      role: "user", // Peran User untuk Gemini
                      parts: [{ text: prompt }] // Isi pesan ada di 'parts'
                  }
              ],
              // Konfigurasi tambahan (opsional)
              // generationConfig: {
              //   temperature: 0.7, // Mengontrol kreativitas (0.0-2.0)
              //   maxOutputTokens: 1000, // Batas panjang respons
              //    topP: 1.0, // Mengontrol keragaman sampling
              //    topK: 40, // Mengontrol keragaman sampling
              // }
          };
  
          try {
              const response = await fetch(GEMINI_API_URL, {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json',
                      // Gemini menggunakan API Key di URL parameter, bukan di header Authorization
                  },
                  body: JSON.stringify(payload),
              });
  
              if (!response.ok) {
                  // Coba baca error message dari response body jika ada
                  let errorDetail = `Error: ${response.status} ${response.statusText}`;
                  try {
                      const errorBody = await response.json();
                      if (errorBody.error && errorBody.error.message) {
                           errorDetail += ` - ${errorBody.error.message}`;
                      } else {
                           // Jika format error tidak standar, tampilkan seluruh body
                           errorDetail += ` - ${JSON.stringify(errorBody)}`;
                      }
                  } catch (jsonError) {
                      // Abaikan jika tidak bisa parse JSON respons error
                  }
                  console.error("Gemini API Error Detail:", errorDetail);
                  throw new Error(`Gemini API Error: ${errorDetail}`);
              }
  
              const data = await response.json();
  
              // Ekstrak teks dari respons Gemini (struktur berbeda dari OpenAI)
              if (data.candidates && data.candidates.length > 0 && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts.length > 0) {
                   return data.candidates[0].content.parts[0].text;
              } else if (data.promptFeedback && data.promptFeedback.blockReason) {
                  // Tangani kasus blokir dari Gemini
                  console.warn("Response blocked by Gemini:", data.promptFeedback);
                  // Anda bisa menampilkan pesan yang lebih spesifik berdasarkan blockReason jika diinginkan
                  return `Maaf, permintaan Anda diblokir oleh filter keamanan AI (${data.promptFeedback.blockReason}). Coba ubah pertanyaan Anda.`;
              }
               else {
                  console.error("Unexpected Gemini API response structure:", data);
                  throw new Error("Format respons AI tidak dikenali atau tidak ada respons.");
              }
  
          } catch (error) {
              console.error("Fetch error:", error);
              // Melempar ulang error agar bisa ditangkap di handleSendMessage
              throw error;
          }
      }
  
       /**
       * Menambahkan pesan ke riwayat internal.
      * Disimpan dalam format role: parts[] sesuai Gemini.
       * @param {'user' | 'ai' | 'model'} role Peran pesan. 'ai' akan dipetakan ke 'model'.
       * @param {string} text Isi pesan
       */
      function addToConversationHistory(role, text) {
          // Petakan peran dari input ('user', 'ai') ke peran standar Gemini ('user', 'model')
          const geminiRole = (role === 'user') ? 'user' : 'model'; // Map 'ai' ke 'model'
  
          conversationHistory.push({ role: geminiRole, parts: [{ text: text }] }); // Gunakan 'parts' bukan 'content'
  
          // Batasi ukuran riwayat jika perlu (opsional)
          const maxHistoryLength = 20; // Contoh: 20 pesan terakhir (10 pasang)
          if (conversationHistory.length > maxHistoryLength) {
              // Simpan hanya 'maxHistoryLength' pesan terakhir
              conversationHistory = conversationHistory.slice(conversationHistory.length - maxHistoryLength);
          }
          // console.log("Conversation History:", conversationHistory); // Untuk debug
      }
  
      /**
       * Menampilkan pesan di area chat.
       * @param {string} text Isi pesan.
       * @param {'user' | 'ai'} sender Pengirim pesan ('user' atau 'ai').
       * @param {boolean} isError Menandakan apakah ini pesan error.
       */
      function displayMessage(text, sender, isError = false) {
          // Pastikan chatHistory ditemukan sebelum menambah elemen
          if (!chatHistory) {
              console.error('Cannot display message: Chat history element not found.');
              return;
          }
          const messageElement = document.createElement('div');
          messageElement.classList.add('message', `${sender}-message`);
          if (isError) {
              messageElement.classList.add('error-message'); // Tambahkan class error jika perlu styling khusus
          }
  
          const bubbleElement = document.createElement('div');
          bubbleElement.classList.add('bubble');
          // Mengganti newline dengan <br> agar format tetap ada dari respons AI
          // HATI-HATI: Menggunakan innerHTML bisa membuka celah XSS jika teks mengandung script.
          // Jika AI bisa menghasilkan markdown, pertimbangkan library sanitasi dan markdown parser.
          // Jika hanya teks biasa, textContent lebih aman.
          // Menggunakan innerHTML dengan replace cukup umum untuk markdown/baris baru, tapi sadari risikonya.
          bubbleElement.innerHTML = text.replace(/\n/g, '<br>');
  
  
          messageElement.appendChild(bubbleElement);
          chatHistory.appendChild(messageElement);
  
          // Scroll ke pesan terbaru
          scrollToBottom();
      }
  
      /**
       * Mengatur ulang ukuran tinggi textarea secara otomatis berdasarkan kontennya.
       * @param {HTMLTextAreaElement} element Textarea yang akan diresize.
       */
      function autoResizeTextarea(element) {
          // Pastikan element ditemukan sebelum diresize
          if (!element) return;
          element.style.height = 'auto'; // Reset tinggi untuk mengukur ulang
          element.style.height = (element.scrollHeight) + 'px'; // Set tinggi sesuai konten
          // Batasi tinggi maksimum jika perlu
          // const maxHeight = 200; // Contoh
          // if (element.scrollHeight > maxHeight) {
          //   element.style.height = maxHeight + 'px';
          //   element.style.overflowY = 'auto';
          // } else {
          //   element.style.overflowY = 'hidden';
          // }
      }
  
      /**
       * Scroll otomatis area chat ke bawah.
       */
      function scrollToBottom() {
          // Pastikan chatHistory ditemukan sebelum scroll
          if (!chatHistory) return;
          // Gunakan setTimeout untuk memastikan rendering selesai sebelum scroll
          setTimeout(() => {
              chatHistory.scrollTop = chatHistory.scrollHeight;
          }, 0);
      }
  
      /**
       * Menampilkan atau menyembunyikan indikator AI sedang mengetik.
       * @param {boolean} show True untuk menampilkan, false untuk menyembunyikan.
       */
      function showTypingIndicator(show) {
          if (typingIndicator) { // Cek ketersediaan elemen
              typingIndicator.style.display = show ? 'block' : 'none';
              // Scroll ke bawah saat indikator muncul agar terlihat
              if (show) {
                  scrollToBottom();
              }
          } else {
              // console.warn('Typing indicator element not found.'); // Matikan log ini jika mengganggu
          }
      }
  
      /**
       * Mengupdate ikon tema berdasarkan status tema terang/gelap.
       * @param {boolean} isLight True jika tema terang aktif.
       */
      function updateThemeIcon(isLight) {
          if (themeIconSun && themeIconMoon) { // Cek ketersediaan elemen
              themeIconSun.style.display = isLight ? 'none' : 'block';
              themeIconMoon.style.display = isLight ? 'block' : 'none';
          } else {
              // console.warn('Theme icon elements not found.'); // Matikan log ini jika mengganggu
          }
      }
  
  }); // End DOMContentLoaded