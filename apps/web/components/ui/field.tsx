import { cn } from "@/lib/utils";
import { Input } from "./input";
import { Label } from "./label";

function Field({
    labelProps,
    inputProps,
    className,
}: {
    labelProps?: React.ComponentProps<typeof Label>;
    inputProps?: React.ComponentProps<typeof Input>;
    className?: string;
}) {
    return (
        <div className={cn("flex flex-col gap-1", className)}>
            <Label {...labelProps}>{labelProps?.children}</Label>
            <Input {...inputProps} />
        </div>
    );
}

export { Field };
