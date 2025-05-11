import { cn } from "@/lib/utils";
import { Spinner } from "@phosphor-icons/react/dist/ssr";
import toast from "react-hot-toast";
import { Address } from "viem";
import Link from "next/link";
import { wagmiConfig } from "@/config/wagmi";

interface ToastProps {
  message: string;
  className?: string;
}

interface SuccessExploreTxProps extends ToastProps {
  txHash: Address | undefined;
}

const displayLoadingTx = ({ message, className }: ToastProps) => {
  toast.custom((t) => (
    <div
      className={cn(
        t.visible ? "animate-enter" : "animate-leave",
        "flex flex-row items-center justify-start space-x-2 bg-main text-black p-4 rounded-lg border-2 border-border",
        className
      )}
    >
      <Spinner
        className="text-black animate-spin size-5"
        onClick={() => toast.dismiss(t.id)}
      />
      <p className="text-neutral-20 text-label">{message}</p>
    </div>
  ));
};

const displaySuccessAndExploreTx = ({
  message,
  txHash,
  className,
}: SuccessExploreTxProps) => {
  toast.custom((t) => (
    <div
      className={cn(
        t.visible ? "animate-enter" : "animate-leave",
        "flex flex-row items-center justify-start space-x-2 bg-main text-black p-4 rounded-lg border-2 border-border",
        className
      )}
    >
      <p className="text-black text-label">{message}</p>
      <Link
        href={`${wagmiConfig.chains[0].blockExplorers?.default.url}/tx/${txHash}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-black underline"
      >
        View on BaseScan
      </Link>
    </div>
  ));
};

export { displayLoadingTx, displaySuccessAndExploreTx };
