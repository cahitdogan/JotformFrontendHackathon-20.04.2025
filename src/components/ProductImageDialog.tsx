import {
    Dialog,
    DialogContent,
  } from "@/components/ui/dialog"

interface ProductImageDialogProps {
    isVisible: boolean;
    setIsProductImageDialogVisible: React.Dispatch<React.SetStateAction<boolean>>;
    activeImageForDialog: string;
}

export default function ProductImageDialog({isVisible, setIsProductImageDialogVisible, activeImageForDialog}: ProductImageDialogProps) {
    return (
        <Dialog 
            open={isVisible} 
            onOpenChange={(open) => setIsProductImageDialogVisible && setIsProductImageDialogVisible(open)}
        >
            <DialogContent>
                <img 
                    className='max-h-[calc(100vh - 3rem)]'
                    src={activeImageForDialog}
                    alt="Product detail"
                />
            </DialogContent>
        </Dialog>
    )
} 