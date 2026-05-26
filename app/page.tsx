'use client';

import { useState } from 'react';

export default function UGCPlatform() {
  const [character, setCharacter] = useState<string | null>(null);
  const [product, setProduct] = useState<string | null>(null);
  const [characterBase64, setCharacterBase64] = useState<string | null>(null);
  const [productBase64, setProductBase64] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [outputImage, setOutputImage] = useState<string | null>(null);

  // Fungsi untuk mengubah file gambar menjadi teks Base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'character' | 'product') => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      if (type === 'character') setCharacter(imageUrl);
      if (type === 'product') setProduct(imageUrl);

      try {
        const base64String = await fileToBase64(file);
        if (type === 'character') setCharacterBase64(base64String);
        if (type === 'product') setProductBase64(base64String);
      } catch (error) {
        console.error("Gagal mengonversi gambar:", error);
      }
    }
  };

  const handleGenerate = async () => {
    if (!characterBase64 || !productBase64) {
      alert("Harap unggah gambar Karakter dan Produk terlebih dahulu.");
      return;
    }
    
    setIsGenerating(true);

    // URL WEBHOOK LO SUDAH DIMASUKKAN DI SINI:
    const webhookUrl = 'https://webhook.site/1fb0f473-97fb-4cbe-9dc8-fb9db4f8d2d8';

    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image_character: characterBase64,
          image_product: productBase64,
          prompt_direction: prompt,
          timestamp: new Date().toISOString()
        }),
      });

      if (response.ok) {
        alert("Data Berhasil Dikirim ke Webhook Cloud!");
      } else {
        alert("Gagal mengirim ke Webhook.");
      }
    } catch (error) {
      console.error("Error saat mengirim data:", error);
      alert("Terjadi kesalahan koneksi jaringan.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!outputImage) return;
    const link = document.createElement('a');
    link.href = outputImage;
    link.download = 'UGC_Ad_Result.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-white p-8 font-sans">
      <header className="max-w-5xl mx-auto mb-10">
        <h1 className="text-3xl font-bold text-white tracking-tight">AI UGC Ad Generator (Cloud Link)</h1>
        <p className="text-neutral-400 mt-2">Sintesis karakter dan produk untuk materi iklan otomatis.</p>
      </header>

      <main className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-neutral-800 p-6 rounded-xl border border-neutral-700 shadow-lg">
          <h2 className="text-xl font-semibold mb-6">Input Parameter</h2>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-neutral-300 mb-2">1. Gambar Karakter (Identity)</label>
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-neutral-600 border-dashed rounded-lg cursor-pointer bg-neutral-700 hover:bg-neutral-600 transition">
                {character ? (
                  <img src={character} alt="Character" className="h-full object-cover rounded-lg" />
                ) : (
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <p className="text-sm text-neutral-400">Klik untuk unggah Karakter</p>
                  </div>
                )}
                <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'character')} />
              </label>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-neutral-300 mb-2">2. Gambar Produk (Item)</label>
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-neutral-600 border-dashed rounded-lg cursor-pointer bg-neutral-700 hover:bg-neutral-600 transition">
                {product ? (
                  <img src={product} alt="Product" className="h-full object-cover rounded-lg" />
                ) : (
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <p className="text-sm text-neutral-400">Klik untuk unggah Produk</p>
                  </div>
                )}
                <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'product')} />
              </label>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-neutral-300 mb-2">3. Arahan Visual (Prompt)</label>
            <textarea 
              className="w-full bg-neutral-900 border border-neutral-600 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              rows={3}
              placeholder="Contoh: Model sedang memegang produk di jalanan kota..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
          </div>

          <button 
            onClick={handleGenerate}
            disabled={isGenerating}
            className={`w-full py-3 rounded-lg font-semibold transition ${isGenerating ? 'bg-neutral-600 text-neutral-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-500 text-white'}`}
          >
            {isGenerating ? 'Mengirim Data Gambar...' : 'Generate Iklan'}
          </button>
        </div>

        <div className="bg-neutral-800 p-6 rounded-xl border border-neutral-700 shadow-lg flex flex-col">
          <h2 className="text-xl font-semibold mb-6">Hasil Output</h2>
          <div className="flex-grow flex items-center justify-center bg-neutral-900 rounded-lg border border-neutral-700 mb-6 overflow-hidden min-h-[300px]">
            {outputImage ? (
              <img src={outputImage} alt="Generated Ad" className="w-full h-full object-contain" />
            ) : (
              <p className="text-neutral-500 text-sm text-center px-4">Area pratinjau hasil.<br/>Hasil render akan muncul di sini.</p>
            )}
          </div>
          <button 
            onClick={handleDownload}
            disabled={!outputImage}
            className={`w-full py-3 rounded-lg font-semibold transition ${!outputImage ? 'bg-neutral-700 text-neutral-500 cursor-not-allowed' : 'bg-green-600 hover:bg-green-500 text-white'}`}
          >
            Unduh Hasil (High-Res)
          </button>
        </div>
      </main>
    </div>
  );
}