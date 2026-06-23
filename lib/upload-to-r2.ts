// Faz upload de um File para o R2 via servidor Next.js (evita CORS)
// Retorna a URL pública do arquivo no CDN
export async function uploadFileToR2(file: File): Promise<string> {
  const formData = new FormData()
  formData.append("file", file)

  // Cookie httpOnly enviado automaticamente pelo browser
  const res = await fetch("/api/storage/upload", {
    method: "POST",
    body: formData,
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error ?? "Erro ao fazer upload")
  }

  const { url } = await res.json()
  return url as string
}
