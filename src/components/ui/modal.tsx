import { Dispatch, SetStateAction } from "react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";

export function Modal({
  children,
  showModal,
  setShowModal,
}: {
  children: React.ReactNode;
  showModal: boolean;
  setShowModal: Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <Dialog open={showModal} onOpenChange={setShowModal}>
      <DialogContent className="overflow-hidden p-0 sm:max-w-[500px]">
        {children}
      </DialogContent>
    </Dialog>
  );
}
