import { useState } from "react";
import Button100 from "./Button100";

/* ----------------------------- Props ---------------------------------- */
type AddExtraBoxProps = {
  modalIsShowing: boolean;
  setModalIsShowing: (value: boolean) => void;
  addLocalExtra: (newExtra: ExtraField) => void;
};

/* ---------------------------- Field Type ------------------------------ */
type ExtraField = {
  type: "text" | "radio" | "checkbox";
  label: string;
  name: string;
  css: string;
  group: string;
};

/* -------------------------- Component --------------------------------- */
export default function AddExtraBox({
  modalIsShowing,
  setModalIsShowing,
  addLocalExtra,
}: AddExtraBoxProps) {
  /* ------------------------ Local State -------------------------------- */
  const [fields, setFields] = useState<ExtraField>({
    type: "text",
    label: "",
    name: "",
    css: "h-5 h-5",
    group: "",
  });

  const types: ExtraField["type"][] = ["text", "radio", "checkbox"];

  // Generate a random ID for element linking
  const randomId = Math.floor(Math.random() * 1000);

  /* ------------------------ Early Return ------------------------------- */
  if (!modalIsShowing) return null;

  /* --------------------------- Render ---------------------------------- */
  return (
    <div className="bg-bg-200 fixed left-5 top-1/3 px-6 py-6 w-[90%] rounded-[10px] shadow-2xl">
      {/* Close button */}
      <button
        className="ml-auto mb-4 text-clr-100 text-text-300 text-right block"
        onClick={() => setModalIsShowing(false)}
      >
        close
      </button>

      {/* Input fields */}
      <div className="flex flex-col gap-4">
        {/* Type selection */}
        <label htmlFor={`${randomId}`} className="text-text-300 text-clr-100 mb-2">
          <p>type:</p>
          <select
            id={`${randomId}`}
            className="outline-none m-0 p-0 border-b-2 border-clr-200 text-clr-200 text-text-100 w-full"
            value={fields.type}
            onChange={(e) => setFields((prev) => ({ ...prev, type: e.target.value as ExtraField["type"] }))}
          >
            {types.map((t, i) => (
              <option key={i} className="bg-bg-100 rounded-lg text-text-100">
                {t}
              </option>
            ))}
          </select>
        </label>

        {/* Label input */}
        <label htmlFor={`${randomId}label`} className="text-text-300 text-clr-100 mb-2">
          <p>label</p>
          <input
            id={`${randomId}label`}
            value={fields.label}
            type="text"
            className="bg-none outline-none border-b-2 border-clr-200 text-clr-200 text-text-100 w-full"
            onChange={(e) => setFields((prev) => ({ ...prev, label: e.target.value }))}
          />
        </label>

        {/* Group input for radio type */}
        {fields.type === "radio" && (
          <label htmlFor={`${randomId}name`} className="text-text-300 text-clr-100 mb-2">
            <p>group</p>
            <input
              id={`${randomId}name`}
              value={fields.name}
              type="text"
              className="bg-none outline-none border-b-2 border-clr-200 text-clr-200 text-text-100 w-full"
              onChange={(e) =>
                setFields((prev) => ({ ...prev, name: e.target.value, group: e.target.value }))
              }
            />
          </label>
        )}
      </div>

      {/* Add button */}
      <Button100
        text="ADD"
        css="text-clr-100 bg-primary mt-4"
        callback={() => {
          /* ------------------ Save to localStorage ------------------ */
          const localStorageName = "tailor-db-extra";
          const arr = JSON.parse(window?.localStorage?.getItem(localStorageName) ?? "[]");
          arr.push(fields);
          window?.localStorage?.setItem(localStorageName, JSON.stringify(arr));

          /* ------------------ Update parent state ------------------ */
          addLocalExtra(fields);

          /* ------------------ Reset form fields ------------------- */
          setFields((prev) => ({ ...prev, label: "", name: "" }));
        }}
      />
    </div>
  );
}
