import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Download, Clock, CheckCircle } from 'lucide-react';

interface DownloadComponentProps {
  product: {
    id: string;
    title: string; 
    price: number;
    file_url?: string;
  };
  onClose: () => void;
}

const DownloadComponent = ({ product, onClose }: DownloadComponentProps) => {
  const isFree = product.price === 0;
  const [countdown, setCountdown] = useState(30); // Always 30 seconds for all products
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadComplete, setDownloadComplete] = useState(false);

  useEffect(() => {
    if (countdown > 0 && !downloadComplete) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && !downloadComplete) {
      startDownload();
    }
  }, [countdown, downloadComplete]);

  const startDownload = async () => {
    setIsDownloading(true);
    
    try {
      if (product.file_url) {
        // Extract filename from URL - handle both direct paths and full URLs
        let filename = product.file_url.split('/').pop() || product.file_url;
        
        // Get file extension from the original file
        const fileExtension = filename.includes('.') ? '.' + filename.split('.').pop() : '.zip';
        
        // Create a clean filename using product title
        const sanitizedTitle = product.title
          .replace(/[^a-zA-Z0-9\s\-_]/g, '') // Remove special characters
          .replace(/\s+/g, '_') // Replace spaces with underscores
          .trim();
        
        const downloadFilename = `${sanitizedTitle}${fileExtension}`;

        // Get signed URL from Supabase storage
        const { data, error } = await supabase.storage
          .from('product-files')
          .createSignedUrl(filename, 3600); // 1 hour expiry

        if (error) {
          console.error('Supabase storage error:', error);
          throw new Error(`Storage error: ${error.message}`);
        }
        
        if (data?.signedUrl) {
          console.log('Starting download with filename:', downloadFilename);
          
          // ✅ FIXED: Always use blob method for reliable downloads without popups
          try {
            const response = await fetch(data.signedUrl, {
              method: 'GET',
              headers: {
                'Accept': '*/*',
                'Accept-Encoding': 'gzip, deflate, br',
                'Accept-Language': 'en-US,en;q=0.9',
                'User-Agent': 'Mozilla/5.0 (compatible)',
              },
              mode: 'cors',
              cache: 'no-cache',
            });
            
            if (!response.ok) {
              throw new Error(`Fetch failed: ${response.status}`);
            }

            const blob = await response.blob();
            
            // Create a new blob with proper type for downloads
            const downloadBlob = new Blob([blob], { 
              type: 'application/octet-stream' 
            });
            const downloadUrl = window.URL.createObjectURL(downloadBlob);
            
            // ✅ FIXED: Create download link WITHOUT target="_blank" (no popup)
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = downloadFilename;
            link.style.display = 'none';
            // ❌ REMOVED: link.target = '_blank'; (this was causing popups)
            // ❌ REMOVED: link.rel = 'noopener noreferrer'; (not needed for same-tab downloads)
            
            document.body.appendChild(link);
            
            // Use user-initiated click to avoid popup blockers
            link.click();
            
            // Cleanup after successful download
            setTimeout(() => {
              document.body.removeChild(link);
              window.URL.revokeObjectURL(downloadUrl);
            }, 100);
            
            setDownloadComplete(true);
            toast({
              title: "Download Complete",
              description: `${product.title} has been downloaded successfully`,
            });
            
          } catch (fetchError) {
            console.log('Blob download failed, trying direct method:', fetchError);
            
            // ✅ FIXED: Fallback direct download WITHOUT popup
            try {
              // Use window.location.href for same-tab navigation
              const tempLink = document.createElement('a');
              tempLink.href = data.signedUrl;
              tempLink.download = downloadFilename;
              tempLink.style.display = 'none';
              // ❌ REMOVED: target="_blank" for no popup
              
              document.body.appendChild(tempLink);
              tempLink.click();
              document.body.removeChild(tempLink);
              
              setDownloadComplete(true);
              toast({
                title: "Download Started",
                description: `${product.title} download has been initiated`,
              });
              
            } catch (directError) {
              console.log('Direct download failed, using location method:', directError);
              
              // Final fallback: navigate to download URL directly
              window.location.href = data.signedUrl;
              
              setDownloadComplete(true);
              toast({
                title: "Download Started",
                description: `${product.title} download has been initiated`,
              });
            }
          }
        } else {
          throw new Error('Unable to create secure download link');
        }
      } else {
        throw new Error('No file available for download');
      }
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: "Download Failed",
        description: error instanceof Error ? error.message : "Unable to download the file. Please contact support.",
        variant: "destructive"
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const progressValue = ((30 - countdown) / 30) * 100;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
      <Card className="w-full max-w-md card-neon animate-scale-in">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2 text-glow font-orbitron">
            <Download className="h-5 w-5" />
            Download {product.title}
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            {downloadComplete ? 'Download completed!' : 'Preparing your secure download...'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {!downloadComplete && (
            <>
              <div className="text-center">
                <div className="relative mb-4">
                  <div className="text-7xl font-orbitron font-black text-neon-cyan mb-2 text-glow animate-pulse">
                    {countdown}
                  </div>
                  <div className="absolute inset-0 text-7xl font-orbitron font-black text-neon-cyan/20 blur-sm">
                    {countdown}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  {countdown > 0 ? 'seconds until secure download' : 'Generating secure download...'}
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-foreground">Progress</span>
                  <span className="text-neon-cyan font-semibold">{Math.round(progressValue)}%</span>
                </div>
                <Progress value={progressValue} className="h-3 bg-muted/30" />
              </div>

              {isDownloading && (
                <div className="flex items-center justify-center gap-2 text-sm text-neon-cyan animate-pulse">
                  <Clock className="h-4 w-4 animate-spin" />
                  Preparing secure download...
                </div>
              )}
            </>
          )}

          {downloadComplete && (
            <div className="text-center space-y-4">
              <div className="relative">
                <CheckCircle className="h-16 w-16 text-neon-green mx-auto animate-pulse" />
                <div className="absolute inset-0 h-16 w-16 text-neon-green/30 blur-sm mx-auto">
                  <CheckCircle className="h-16 w-16" />
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-orbitron font-semibold text-glow">Download Complete!</h3>
                <p className="text-sm text-muted-foreground">
                  Your file has been downloaded securely. Check your downloads folder.
                </p>
              </div>
              <Button 
                onClick={startDownload}
                variant="outline"
                className="w-full border-neon-cyan text-neon-cyan hover:bg-neon-cyan/10"
              >
                <Download className="h-4 w-4 mr-2" />
                Download Again
              </Button>
            </div>
          )}

          <Button 
            onClick={onClose}
            variant="ghost"
            className="w-full mt-4 hover:bg-muted/20"
          >
            Close
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default DownloadComponent;
