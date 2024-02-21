import React from "react";
import Formfield from "@/components/Formfield";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
const Signin = () => {
  return (
    <div>
      <Formfield>
        <Label>Name</Label>
        <Input type="text" onChange={(e) => setName(e.target.value)} />
      </Formfield>
      <Formfield>
        <Label>Email</Label>
        <Input name="email" onChange={(e) => setEmail(e.target.value)} />
      </Formfield>
    </div>
  );
};

export default Signin;
