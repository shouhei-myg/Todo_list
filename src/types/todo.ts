export type Todo = {
  id: number;
  inputValue: string;
  createdAt: number;
  status: "todo" | "done";
  editable?: boolean; // チェックで編集可能にするフラグ
};
