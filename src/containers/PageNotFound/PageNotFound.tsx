import { Button, Empty, Typography } from "antd";
import { navigateRef } from "../../containers/CommonInit/CommonInit";

export default function PageNotFound() {
  return (
    <Empty
      image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
      styles={{ image: { height: 60 } }}
      description={<Typography.Text>Page not found</Typography.Text>}
    >
      <Button
        type="primary"
        onClick={() => {
          navigateRef.current("auth");
        }}
      >
        Go back to Personal Notes page
      </Button>
    </Empty>
  );
}
