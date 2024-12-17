export function Container(props: React.PropsWithChildren) {
  return (
    <div className="flex items-center justify-between border-t border-textureLightGrayOld bg-white px-4 py-3 sm:px-6">
      {props.children}
    </div>
  );
}
