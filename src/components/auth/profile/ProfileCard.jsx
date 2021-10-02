import React from "react";
import { Button, Card } from "react-bootstrap";
import { useAuth } from "../../../contexts/AuthContext";

function ProfileCard() {
  const { user } = useAuth();

  return (
    <Card bg="secondary" className="p-0 text-center">
      <Card.Header>
        <Card.Title>My Profile</Card.Title>
      </Card.Header>
      <Card.Body>
        <Card.Img
          src={user?.imageUrl}
          alt="Profile"
          className="img-fluid rounded-circle mb-2"
          style={{
            width: 100,
          }}
        />
        <Card.Subtitle>{user?.name}</Card.Subtitle>
        <Card.Text>{user?.email}</Card.Text>
      </Card.Body>
      <Card.Footer>
        <Button variant="danger" size="sm">
          Logout
        </Button>
      </Card.Footer>
    </Card>
  );
}

export default ProfileCard;
