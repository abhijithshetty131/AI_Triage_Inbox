import React from 'react';
import { TriageItem } from '../types';
interface InboxListItemProps {
    item: TriageItem;
    isSelected: boolean;
    isSelectedCheckbox: boolean;
    onSelect: () => void;
    onToggleSelect: (e: React.MouseEvent) => void;
    'data-item'?: boolean;
}
declare const InboxListItem: React.FC<InboxListItemProps>;
export default InboxListItem;
//# sourceMappingURL=InboxListItem.d.ts.map