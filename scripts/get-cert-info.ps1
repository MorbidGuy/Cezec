$target = 'cezec.com.br'
try {
	$tcp = New-Object System.Net.Sockets.TcpClient($target, 443)
	$stream = $tcp.GetStream()
	$ssl = New-Object System.Net.Security.SslStream($stream, $false, ({$true}))
	$ssl.AuthenticateAsClient($target)
	$cert = [System.Security.Cryptography.X509Certificates.X509Certificate2]::new($ssl.RemoteCertificate)
	Write-Output "Subject: $($cert.Subject)"
	Write-Output "Issuer: $($cert.Issuer)"
	Write-Output "Thumbprint: $($cert.Thumbprint)"
	Write-Output "NotBefore: $($cert.NotBefore)"
	Write-Output "NotAfter: $($cert.NotAfter)"
} catch {
	Write-Output "Erro ao obter certificado: $_"
} finally {
	if ($ssl) { $ssl.Close() }
	if ($tcp) { $tcp.Close() }
}
