// Faz upload de um File para o R2 via URL pré-assinada
// Retorna a URL pública do arquivo no CDN
export async function uploadFileToR2(file: File, token: string): Promise<string> {
  // 1. Pede URL pré-assinada ao backend
  const presignRes = await fetch("/api/storage/presign", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      filename: file.name,
      contentType: file.type || "image/png",
    }),
  })

  if (!presignRes.ok) {
    const err = await presignRes.json().catch(() => ({}))
    throw new Error(err.error ?? "Erro ao obter URL de upload")
  }

  const { presignedUrl, publicUrl } = await presignRes.json()

  // 2. Faz upload direto para o R2 com a URL pré-assinada
  const uploadRes = await fetch(presignedUrl, {
    method: "PUT",
    headers: { "Content-Type": file.type || "image/png" },
    body: file,
  })

  if (!uploadRes.ok) {
    throw new Error("Erro ao fazer upload da imagem. Tente novamente.")
  }

  return publicUrl as string
}
