export default function Avatar({
  name,
  src,
  size = 40,
}: {
  name?: string;
  src?: string;
  size?: number;
}) {
  const initials = name
    ? name
        .split(" ")
        .map((s) => s[0])
        .slice(0, 2)
        .join("")
    : "?";

  const rootStyle = {
    width: size,
    height: size,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "50%",
    backgroundColor: "#ccc",
    overflow: "hidden",
    fontSize: Math.round(size / 2),
    color: "#fff",
  };

  return (
    <div style={rootStyle}>
      {src ? (
        <img
          src={src}
          alt={name}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
}
