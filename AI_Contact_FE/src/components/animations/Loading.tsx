import { TailChase } from "ldrs/react";

export default function Loading() {
  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      aria-label="로딩중"
    >
      <TailChase size="40" speed="1.75" color="#735ae1" />
    </div>
  );
}
