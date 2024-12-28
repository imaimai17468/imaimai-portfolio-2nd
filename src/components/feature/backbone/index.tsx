import { BackboneList } from "./backbone-list";
import { BackboneLayout } from "./layout";
import { Motto } from "./motto";

export const Backbone: React.FC = () => {
  return (
    <BackboneLayout>
      <Motto />
      <BackboneList />
    </BackboneLayout>
  );
};
