import {
  Text,
  Hash,
  CheckCircle,
  List,
  Link,
  AtSign,
  Calendar,
  Globe,
  Brackets,
  ArrowRight,
  ArrowRightLeft,
  ArrowUpRight,
} from "lucide-react";

export const AttributeIcon = (attribute: any, isArray: boolean = false) => {
  const icons = {
    string: <Text size={16} />,
    integer: <Hash size={16} />,
    boolean: <CheckCircle size={16} />,
    enum: <List size={16} />,
    url: <Link size={16} />,
    email: <AtSign size={16} />,
    relationship: <ArrowUpRight size={16} />,
    datetime: <Calendar size={16} />,
    ip: <Globe size={16} />,
  };
  const type = (attribute.format || attribute.type) as keyof typeof icons;

  return (
    <div className="flex items-center gap-2 size-8 neutral-background-alpha-strong rounded-full relative justify-center">
      {icons[type]}
      {(isArray || type === 'relationship') && (
        <div className="absolute bottom-0 right-0">
          {isArray && <Brackets size={10} />}
          {type === 'relationship' && (
            <RelationshipIcon type={attribute?.twoWay ?
              'twoWay' : 'oneWay'
            } />
          )}
        </div>
      )}
    </div>
  );
};


export const RelationshipIcon = ({ type }: { type: 'oneWay' | 'twoWay' }) => {
  const icons = {
    oneWay: <ArrowRight size={10} />,
    twoWay: <ArrowRightLeft size={10} />

  };

  return icons[type];
}