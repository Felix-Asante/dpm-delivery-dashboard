import { getVariables } from "@/actions/variables";
import WithServerError from "@/components/hoc/WithServerError";
import VariableSection from "./_sections/VariableSection";

export default async function Variables() {
  const { error, results } = await getVariables();
  return (
    <WithServerError error={error}>
      <div className="bg-white h-screen px-5 pt-5">
        <VariableSection variables={results!} />
      </div>
    </WithServerError>
  );
}
