import { Link, useLocation, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { API_PATH } from "../../App";
import { Button, Form, Heading, Level } from "react-bulma-components";
import { User } from "./UsersPage";

const emptyUser = {
  ID: 0,
  Name: "",
  Email: "",
  Active: true,
  Admin: false,
  CreatedAt: "",
  LastLoggedIn: "",
} as User;

export const EditUserPage = () => {
  const location = useLocation();
  const [user, setUser] = useState(emptyUser);
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (location?.state?.user as User) {
      // to edit an existing user
      setUser(location.state.user);
    } else {
      // to create a new user
      setUser(emptyUser);
    }
  }, [location.state]);

  const validateFields = (): boolean => {
    if (user.Name.length === 0) {
      alert("Name must not be blank!");
      return false;
    }
    if (user.Email.length === 0) {
      alert("Email must not be blank!");
      return false;
    }
    return true;
  };

  const save = async () => {
    setSaving(true);
    if (!validateFields()) {
      setSaving(false);
      return;
    }

    try {
      const resp = await fetch(API_PATH + `/users/${user.ID || ""}`, {
        headers: {
          "Content-Type": "application/json",
        },
        method: location?.state?.user ? "PUT" : "POST",
        mode: "cors", // no-cors, *cors, same-origin
        credentials: "include", // include, *same-origin, omit
        body: JSON.stringify(user),
      });
      if (resp.status !== 200) {
        const err = await resp.text();
        throw err;
      }
      // success
      navigate("/users");
    } catch (e) {
      console.error(e);
      alert("Failed to save user. Maybe they already exist?");
      setSaving(false);
    }
  };

  return (
    <>
      <Level>
        <Level.Side>
          <Level.Item>
            <Heading size={5}>{user.ID ? "Edit" : "New"} User</Heading>
          </Level.Item>
        </Level.Side>
      </Level>

      <Form.Field>
        <Form.Label>Name</Form.Label>
        <Form.Field kind="addons">
          <Form.Control fullwidth>
            <Form.Input
              type="text"
              autoFocus
              value={user.Name}
              onChange={(evt) =>
                setUser((prev) => ({ ...prev, Name: evt.target.value }))
              }
            />
          </Form.Control>
        </Form.Field>
      </Form.Field>

      <Form.Field>
        <Form.Label>Email</Form.Label>
        <Form.Field kind="addons">
          <Form.Control fullwidth>
            <Form.Input
              type="email"
              value={user.Email}
              onChange={(evt) =>
                setUser((prev) => ({ ...prev, Email: evt.target.value }))
              }
              onKeyPress={(e) => {
                if (e.key === "Enter") save();
              }}
            />
          </Form.Control>
        </Form.Field>
      </Form.Field>

      <Form.Field kind={"group"}>
        <Form.Control>
          <Form.Checkbox
            checked={user.Active}
            onChange={(evt) =>
              setUser((prev) => ({ ...prev, Active: evt.target.checked }))
            }
          />
        </Form.Control>
        <Form.Control>
          <Form.Label
            onClick={() =>
              setUser((prev) => ({ ...prev, Active: !prev.Active }))
            }
          >
            Active
          </Form.Label>
        </Form.Control>
      </Form.Field>

      <Form.Field kind={"group"}>
        <Form.Control>
          <Form.Checkbox
            checked={user.Admin}
            onChange={(evt) =>
              setUser((prev) => ({ ...prev, Admin: evt.target.checked }))
            }
          />
        </Form.Control>
        <Form.Control>
          <Form.Label
            onClick={() => setUser((prev) => ({ ...prev, Admin: !prev.Admin }))}
          >
            Admin{" "}
            <span style={{ fontWeight: "normal" }}>
              (gives access to manage other users)
            </span>
          </Form.Label>
        </Form.Control>
      </Form.Field>

      {user.LastLoggedIn && (
        <>
          <strong>Last logged in:</strong> {user.LastLoggedIn}
        </>
      )}

      <Form.Field kind="group" className={"pt-4"}>
        <Form.Control>
          <Button color="link" onClick={save} disabled={saving}>
            Save
          </Button>
        </Form.Control>
        <Form.Control>
          <Link to={"/users"}>
            <Button color="link" colorVariant="light">
              Cancel
            </Button>
          </Link>
        </Form.Control>
      </Form.Field>
    </>
  );
};