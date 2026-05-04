import { useRef } from "react";
import { useRecords } from "@/store/app";
import { Button } from "@/components/ui/button";
import { FileHeart, Upload, Trash2, FileText, Image as ImgIcon, Download } from "lucide-react";
import { Reveal } from "@/components/animations";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

export default function Records() {
  const { items, add, remove } = useRecords();
  const inputRef = useRef<HTMLInputElement>(null);

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) return toast.error("Max 5MB per file");
    const r = new FileReader();
    r.onload = () => { add({ name: file.name, type: file.type, size: file.size, dataUrl: r.result as string }); toast.success("Record uploaded"); };
    r.readAsDataURL(file);
    e.target.value = "";
  };

  return (
    <div className="container mx-auto py-8 max-w-3xl">
      <Reveal>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-display font-bold">Health Records</h1>
            <p className="text-muted-foreground text-sm">Upload prescriptions, reports & lab results.</p>
          </div>
          <Button onClick={() => inputRef.current?.click()} className="rounded-full bg-gradient-primary border-0 shadow-glow">
            <Upload className="w-4 h-4 mr-1" />Upload
          </Button>
          <input ref={inputRef} type="file" accept="image/*,application/pdf" onChange={onFile} hidden />
        </div>
      </Reveal>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-12 text-center">
          <FileHeart className="w-8 h-8 mx-auto text-muted-foreground mb-3" />
          <p className="font-medium">No records yet</p>
          <p className="text-xs text-muted-foreground mt-1">PDF or image, up to 5MB each.</p>
        </div>
      ) : (
        <AnimatePresence>
          <div className="grid sm:grid-cols-2 gap-3">
            {items.map((r) => {
              const isImg = r.type.startsWith("image/");
              return (
                <motion.div key={r.id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                  className="rounded-2xl border border-border bg-card overflow-hidden hover-lift">
                  {isImg ? (
                    <img src={r.dataUrl} alt={r.name} className="w-full h-32 object-cover" />
                  ) : (
                    <div className="h-32 grid place-items-center bg-muted"><FileText className="w-10 h-10 text-muted-foreground" /></div>
                  )}
                  <div className="p-4">
                    <p className="font-medium text-sm truncate">{r.name}</p>
                    <p className="text-xs text-muted-foreground">{(r.size / 1024).toFixed(0)} KB • {new Date(r.date).toLocaleDateString("en-IN")}</p>
                    <div className="mt-2 flex gap-2">
                      <Button size="sm" variant="outline" asChild className="rounded-full flex-1">
                        <a href={r.dataUrl} download={r.name}><Download className="w-3 h-3 mr-1" />Download</a>
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => remove(r.id)} className="rounded-full hover:bg-destructive/10 hover:text-destructive">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </AnimatePresence>
      )}
    </div>
  );
}
