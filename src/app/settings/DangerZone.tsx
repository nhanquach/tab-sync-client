"use client";

import { IUser } from "../../interfaces/IUser";
import DeleteAccountForm from "components/feedback-form/DeleteAccountForm";

type DangerZoneProps = {
  user: IUser;
};

const DangerZone = ({ user }: DangerZoneProps) => {
  const openDialog = () => {
    (document.getElementById("delete-account-dialog") as any).showModal();
  };

  const closeDialog = () => {
    (document.getElementById("delete-account-dialog") as any).close();
  };

  return (
    <div className="card card-body">
      <h2 className="card-title">Danger zone</h2>
      <div className="card-actions">
        <button className="btn btn-soft btn-warning" onClick={openDialog}>
          Delete Account
        </button>
      </div>
      <dialog id="delete-account-dialog" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Delete Account Request</h3>
          <DeleteAccountForm user={user} closeDialog={closeDialog} />
        </div>
      </dialog>
    </div>
  );
};

export default DangerZone;
