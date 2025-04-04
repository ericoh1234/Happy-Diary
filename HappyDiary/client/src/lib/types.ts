import { Entry } from "@shared/schema";

export type EntryWithState = Entry & {
  isEditing?: boolean;
};
